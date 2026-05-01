import { Prisma } from "../generated/prisma/client";

class DatabaseError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "DatabaseError";
    this.code = code;
  }

  static fromPrisma(error: unknown): DatabaseError {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      switch (error.code) {
        case "P2025":
          return new DatabaseError(
            "Resource not found or access denied",
            error.code
          );

        case "P2002":
          return new DatabaseError(
            "Unique constraint failed",
            error.code
          );

        default:
          return new DatabaseError(
            "Database request error",
            error.code
          );
      }
    }

    throw error;
  }
}

export default DatabaseError;