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

  input TaskInput {
    id: ID
    title: String
    status: TaskStatus
    priority: TaskPriority
    reportedBy: ID
    assignedTo: ID
    project: ID
  }

  type Query {
    tasks(input: TaskInput): [Task!]!
  }
`