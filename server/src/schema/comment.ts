export const commentTypeDefs = `#graphql
  type Comment {
    id: ID!
    body: String!
    task: Task!
    author: User!
    createdAt: String!
    updatedAt: String!
  }

  input CreateComment {
    body: String!
    taskId: ID!
  }

  input UpdateComment {
    id: ID!
    body: String
  }

  input DeleteComment {
    id: ID!
  }

  type Mutation {
    createComment(input: CreateComment!): Comment!
    updateComment(input: UpdateComment!): Comment!
    deleteComment(input: DeleteComment!): ID!
  }
`
