export const enumTypeDefs = `#graphql
  enum TaskStatus {
    TODO
    IN_PROGRESS
    DONE
  }

  enum TaskPriority {
    LOW
    MEDIUM
    HIGH
  }

  enum ProjectRole {
    OWNER
    MEMBER
  }
`