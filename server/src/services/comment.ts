import z from "zod";
import { ServiceProps } from "../types/services";
import ValidationError from "../utils/errors";
import DatabaseError from "../utils/databaseError";


const createCommentSchema = z.object({
  body: z.string().min(1).max(1000).trim(),
  taskId: z.string().min(1).trim()
})

const updateCommentSchema = z.object({
  body: z.string().min(1).max(1000).trim().optional(),
  id: z.string().min(1).trim()
})

const deleteCommentSchema = z.object({
  id: z.string().min(1).trim()
})


export const createComment = async ({context, input}: ServiceProps) => {
  const data = createCommentSchema.safeParse(input);

  if (data.error) {
    throw new ValidationError(data.error.issues);
  }

  const task = await context.db.task.findFirst({
    where: {
      id: data.data.taskId,
      isActive: true,
      project: {
        members: {
          some: {
            userId: context.userId!
          }
        }
      },
    }
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const comment = await context.db.comment.create({
    data: {
      ...data.data,
      userId: context.userId!,
    },
  });

  return comment;
};

export const updateComment = async ({context, input}: ServiceProps) => {
  const data = updateCommentSchema.safeParse(input);

  if (data.error) {
    throw new ValidationError(data.error.issues);
  }

  try {
    const comment = await context.db.comment.update({
      data: {...(data.data.body && {body: data.data.body})},
      where: {
        id: data.data.id,
        userId: context.userId!
      }
    });
    return comment;
  } catch (error) {
    throw DatabaseError.fromPrisma(error);
  }
};

export const deleteComment = async ({context, input}: ServiceProps) => {
  const data = deleteCommentSchema.safeParse(input);
  if (data.error) {
    throw new ValidationError(data.error.issues);
  }

  try {
    const comment = await context.db.comment.update({
      data: {isActive: false},
      where: {
        id: data.data.id,
        userId: context.userId!
      }
    });
    return comment.id;
  } catch (error) {
    throw DatabaseError.fromPrisma(error);
  }
};
