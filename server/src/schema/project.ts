export const projectTypeDefs = `#graphql
  type Project {
    id: ID!
    name: String!
    description: String
    members: [ProjectMember!]!
    tasks: [Task!]!
    createdAt: String!
    updatedAt: String!
  }

  input ProjectsInput {
    id: ID
    name: String
    description: String
  }

  input ProjectInput {
    id: ID!
  }

  type Query {
    projects(input: ProjectsInput): [Project!]!
    project(input: ProjectInput!): Project
  }

  input CreateProjectInput {
    name: String!
    description: String
  }

  input UpdateProjectInput {
    id: ID!
    name: String
    description: String
  }

  input DeleteProjectInput {
    id: ID!
  }

  type Mutation {
    createProject(input: CreateProjectInput!): Project!
    updateProject(input: UpdateProjectInput!): Project!
    deleteProject(input: DeleteProjectInput!): ID!
  }
`