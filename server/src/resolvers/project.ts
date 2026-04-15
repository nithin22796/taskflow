import { Context } from "../context";
import { createProject, deleteProject, getProject, getProjects, updateProject } from "../services/project";
import { requireAuth } from "../utils/auth";

export const projectResolvers = {
  Query: {
    projects: async (parent, args, context: Context) => {
      requireAuth({context});
      const projects = await getProjects({context, input: args.input ?? {}});
      return projects;
    },
    project: async (parent, args, context: Context) => {
      requireAuth({context});

      const project = await getProject({context, input: args.input});
      return project;
    }
  },
  Mutation: {
    createProject: async (parent, args, context: Context) => {
      requireAuth({context});

      const project = await createProject({context, input: args.input});
      return project;
    },
    updateProject: async (parent, args, context: Context) => {
      requireAuth({context});

      const project = await updateProject({context, input: args.input});
      return project;
    },
    deleteProject: async (parent, args, context: Context) => {
      requireAuth({context});

      const project = await deleteProject({context, input: args.input});
      return project;
    }
  }
}