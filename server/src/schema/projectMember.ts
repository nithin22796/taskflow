export const projectMemberTypeDefs = `#graphql
  type ProjectMember {
    id: ID!
    user: User!
    project: Project!
    userRole: ProjectRole!
    createdAt: String!
    updatedAt: String!
  }
`
