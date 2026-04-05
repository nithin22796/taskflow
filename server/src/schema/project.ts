export const projectTypeDefs = `#graphql
  type Project {
    id: ID!
    name: String!
    description: String
    members: [User!]!
    tasks: [Task!]!
    createdAt: String!
    updatedAt: String!
  }

  input ProjectInput {
    id: ID
    name: String
    description: String
  }

  type Query {
    projects(input: ProjectInput): [Project!]!
  }
`