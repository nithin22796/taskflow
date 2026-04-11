export const userTypeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    isVerified: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input UserInput {
    id: ID
    email: String
  }

  type Query {
    me: User
    user(input: UserInput!): User
  }

  input UpdateUserInput {
    id: ID!
    name: String
    email: String
    password: String
  }

  input DeleteUserInput {
    id: ID!
  }

  type Mutation {
    updateUser(input: UpdateUserInput!): User!
    deleteUser(input: DeleteUserInput!): User
  }
`