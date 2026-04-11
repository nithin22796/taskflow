export const authTypeDef = `#graphql
  type AuthPayload {
    id: ID!
    name: String!
    email: String!
    isVerified: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    email: String!
    name: String!
    password: String!
  }

  type Mutation {
    login(input: LoginInput!): AuthPayload
    register(input: RegisterInput!): AuthPayload
  }
`