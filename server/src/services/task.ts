import z from "zod";
import { ServiceProps } from "../types/services";
import ValidationError from "../utils/errors";
import { ProjectRole, TaskPriority, TaskStatus } from "../generated/prisma/enums";

const createTaskSchema = z.object({
  title: z.string().min(3, "Title is a required field!").trim(),
  description: z.string().max(500).optional(),
  projectId: z.string().min(1).trim()
})

const deleteTaskSchema = z.object({
  id: z.string().min(1).trim()
})

const updateTaskSchema = z.object({
  id: z.string().min(1).trim(),
  title: z.string().min(3, "Title is a required field!").trim().optional(),
  description: z.string().max(500).optional(),
  status: z.enum(TaskStatus).optional(),
  priority: z.enum(TaskPriority).optional(),
  assignedTo: z.string().min(1).trim().optional()
})

const getTasksSchema = z.object({
  title: z.string().trim().optional(),
  status: z.enum(TaskStatus).optional(),
  priority: z.enum(TaskPriority).optional(),
});

const getTaskSchema = z.object({
  id: z.string().min(1).trim()
});

export const createTask = async ({context, input}: ServiceProps) => {

  const data = createTaskSchema.safeParse(input);

  if (data.error) {
    throw new ValidationError(data.error.issues);
  }

  const {projectId, title, description} = data.data;

  const user = await context.db.projectMember.findFirst({
    where: {
      projectId,
      userId: context.userId!
    }
  });

  if (!user) {
    throw new Error("User is not part of the project!");
  }

  const task = await context.db.task.create({
    data: {title, description, projectId, reportedById: context.userId!}
  });

  return task;
}

export const deleteTask = async ({context, input}: ServiceProps) => {
  const data = deleteTaskSchema.safeParse(input);

  if (data.error) {
    throw new ValidationError(data.error.issues);
  }

  const {id} = data.data;

  const task = await context.db.task.findFirst({
    where: {
      id,
      isActive: true
    }
  })

  if (!task) {
    throw new Error("No Task found!");
  }

  const user = await context.db.projectMember.findFirst({
    where: {
      projectId: task.projectId,
      userId: context.userId!
    }
  });

  if (!user) {
    throw new Error("Cannot perform delete!!");
  }

  const canDelete = user.userRole === ProjectRole.OWNER || user.userId === task.reportedById

  if (!canDelete) {
    throw new Error("Cannot perform delete!!");
  }

  const deletedTask = await context.db.task.update({
    data: {isActive: false},
    where: {id}
  });

  return deletedTask.id;
}

export const updateTask = async ({context, input}: ServiceProps) => {
  const data = updateTaskSchema.safeParse(input);

  if (data.error) {
    throw new ValidationError(data.error.issues);
  }

  const {id, priority, status, assignedTo, description, title} = data.data;

  const task = await context.db.task.findFirst({
    where: {
      id,
      isActive: true
    }
  })

  if (!task) {
    throw new Error("No Task found!");
  }

  const user = await context.db.projectMember.findFirst({
    where: {
      projectId: task.projectId,
      userId: context.userId!
    }
  });

  if (!user) {
    throw new Error("Cannot perform update!!");
  }

  const {DONE} = TaskStatus;

  const updatedTask = await context.db.task.update({
    data: {
      ...title && {title},
      ...description && {description},
      ...priority && {priority},
      ...assignedTo && {assignedToId: assignedTo},
      ...status && {
        resolvedById: status === DONE ? context.userId! : null,
        verifiedById: status === DONE ? context.userId! : null,
        status
      },
    },
    where: {id}
  });

  return updatedTask;
}

export const getTasks = async ({context, input}: ServiceProps) => {

  const inputData = getTasksSchema.safeParse(input);

  if (inputData.error) {
    throw new ValidationError(inputData.error.issues);
  }

  const {title, priority, status} = inputData.data;

  const tasksList = await context.db.task.findMany({
    where: {
      isActive: true,
      project: {
        members: {
          some: {
            userId: context.userId!
          }
        }
      },
      ...title && {title: {contains: title, mode: "insensitive"}},
      ...priority && {priority: {equals: priority}},
      ...status && {status: {equals: status}},
    }
  })

  return tasksList;
}

export const getTask = async ({context, input}: ServiceProps) => {

  const inputData = getTaskSchema.safeParse(input);

  if (inputData.error) {
    throw new ValidationError(inputData.error.issues);
  }

  const {id} = inputData.data;

  const task = await context.db.task.findFirst({
    where: {
      id,
      isActive: true,
      project: {
        members: {
          some: {
            userId: context.userId!
          }
        }
      },
    }
  })

  return task;
}