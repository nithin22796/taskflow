export const commentTypeDefs = `#graphql
  type Comment {
    id: ID!
    body: String!
    task: Task!
    author: User!
    createdAt: String!
    updatedAt: String!
  }

  input CommentInput {
    taskId: ID
    authorId: ID
  }

  type Query {
    comments(input: CommentInput): [Comment!]!
  }
`
