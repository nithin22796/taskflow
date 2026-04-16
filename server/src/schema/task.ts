export const taskTypeDefs = `#graphql
  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    priority: TaskPriority!
    createdAt: String!
    updatedAt: String!
    reportedBy: User!
    assignedTo: User
    resolvedBy: User
    verifiedBy: User
    project: Project!
    comments: [Comment!]!
  }

  input TasksInput {
    title: String
    status: TaskStatus
    priority: TaskPriority
  }

  input TaskInput {
    id: ID!
  }

  input CreateTask {
    title: String!
    description: String
    projectId: ID!
  }

  input UpdateTask {
    id: ID!
    title: String
    description: String
    status: TaskStatus
    priority: TaskPriority
    assignedTo: ID
  }

  input DeleteTask {
    id: ID!
  }

  type Query {
    tasks(input: TasksInput): [Task!]!
    task(input: TaskInput!): Task
  }

  type Mutation {
    createTask(input: CreateTask!): Task!
    updateTask(input: UpdateTask!): Task!
    deleteTask(input: DeleteTask!): ID!
  }
`