import { Context } from "../context";
import { createTask, deleteTask, getTask, getTasks, updateTask } from "../services/task";
import { requireAuth } from "../utils/auth";

export const taskResolvers = {
  Task: {
    reportedBy: async (parent, args, context: Context) => {
      const user = parent.reportedById && await context.db.user.findFirst({where: {id: parent.reportedById}});
      return user ?? null;
    },
    assignedTo: async (parent, args, context: Context) => {
      const user = parent.assignedToId && await context.db.user.findFirst({where: {id: parent.assignedToId}});
      return user ?? null;
    },
    resolvedBy: async (parent, args, context: Context) => {
      const user = parent.resolvedById && await context.db.user.findFirst({where: {id: parent.resolvedById}});
      return user ?? null;
    },
    verifiedBy: async (parent, args, context: Context) => {
      const user = parent.verifiedById && await context.db.user.findFirst({where: {id: parent.verifiedById}});
      return user ?? null;
    },
    project: async (parent, args, context: Context) => {
      const project = await context.db.project.findFirst({where: {id: parent.projectId}});
      return project;
    },
    comments: async (parent, args, context: Context) => {
      const comments = await context.db.comment.findMany({where: {taskId: parent.id}});
      return comments;
    },
  },
  Query: {
    tasks: async (parent, args, context: Context) => {
      requireAuth({context});

      const tasks = await getTasks({context, input: args.input ?? {}});

      return tasks;
    },
    task: async (parent, args, context: Context) => {
      requireAuth({context});

      const task = await getTask({context, input: args.input});
      return task;
    },
  },
  Mutation: {
    createTask: async (parent, args, context: Context) => {
      requireAuth({context});

      const task = await createTask({context, input: args.input});
      return task;
    },
    updateTask: async (parent, args, context: Context) => {
      requireAuth({context});

      const task = await updateTask({context, input: args.input});
      return task;
    },
    deleteTask: async (parent, args, context: Context) => {
      requireAuth({context});

      const task = await deleteTask({context, input: args.input});
      return task;
    },
  }
}