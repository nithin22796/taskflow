import z from "zod";
import ValidationError from "../utils/errors";
import { ProjectRole } from "../generated/prisma/enums";
import { Prisma } from "../generated/prisma/client";
import { ServiceProps } from "../types/services";

const createProjectSchema = z.object({
  name: z.string("Project name cannot be empty")
    .min(3, "Project name too short")
    .trim(),
  description: z.string().max(500, "Description too long").optional()
});

const updateProjectSchema = z.object({
  id: z.string(),
  name: z.string("Project name cannot be empty")
    .min(3, "Project name too short")
    .trim()
    .optional(),
  description: z.string().max(500, "Description too long").optional()
});

const deleteProjectSchema = z.object({
  id: z.string()
});

const getProjectsInputSchema = z.object({
  id: z.string().trim().optional(),
  name: z.string().trim().optional(),
  description: z.string().optional()
})

const getProjectSchema = z.object({
  id: z.string().trim()
});

export const createProject = async ({context, input}: ServiceProps) => {
  const data = createProjectSchema.safeParse(input);

  if (data.error) {
    throw new ValidationError(data.error.issues);
  }

  console.log("Creating project....");
  const project = await context.db.$transaction(async (tx) => {
    const prj = await tx.project.create({ data: {...data.data, ownerId: context.userId!} });
    await tx.projectMember.create({ data: {
      projectId: prj.id,
      userId: context.userId!,
      userRole: ProjectRole.OWNER
    }})
    return prj;
  })

  return project;
}

export const updateProject = async ({context, input}: ServiceProps) => {
  const data = updateProjectSchema.safeParse(input);

  if (data.error) {
    throw new ValidationError(data.error.issues);
  }

  try {
    const project = await context.db.project.update({
      data: data.data,
      where: {
        id: data.data.id,
        ownerId: context.userId!
      }
    });

    return project;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new Error('Project not found or you do not have permission')
    }
  }
}

export const deleteProject = async ({context, input}: ServiceProps) => {
  const data = deleteProjectSchema.safeParse(input);

  if (data.error) {
    throw new ValidationError(data.error.issues);
  }

  try {
    const project = await context.db.$transaction(async (tx) => {
      await tx.projectMember.deleteMany({
        where: {
          projectId: data.data.id
      }})

      const prj = await tx.project.update({
        data: {isActive: false},
        where: {
          id: data.data.id,
          ownerId: context.userId!
        }}
      )
      return prj;
    })
    return project.id;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new Error('Project not found or you do not have permission')
    }
  }
}

export const getProjects = async ({context, input}: ServiceProps) => {

  const data = getProjectsInputSchema.safeParse(input);

  if (data.error) {
    throw new ValidationError(data.error.issues);
  }
  const {description, name, id} = data.data;

  const projects = await context.db.project.findMany({
    where: {
      isActive: true,
      members: {
        some: {
          userId: context.userId!
        }
      },
      ...id && {id: {equals: id}},
      ...name && {name: {contains: name, mode: "insensitive"}},
      ...description && {description: {contains: description, mode: "insensitive"}}
    },
    include: {
      members: {
        include: {
          user: true
        }
      }
    }
  })
  return projects;
}

export const getProject = async ({context, input}: ServiceProps) => {

  const data = getProjectSchema.safeParse(input);

  if (data.error) {
    throw new ValidationError(data.error.issues);
  }

  const {id} = data.data;

  const project = await context.db.project.findFirst({
    where: {
      isActive: true,
      members: {
        some: {
          userId: context.userId!
        }
      },
      id
    }
  });
  return project;
}