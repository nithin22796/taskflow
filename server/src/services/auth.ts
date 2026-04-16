import { z } from "zod";
import bcrypt from "bcrypt";
import { Prisma } from "../generated/prisma/client";
import ValidationError from "../utils/errors";
import { ServiceProps } from "../types/services";

const registerSchema = z.object({
  email: z.email("Invalid Email"),
  name: z.string()
    .min(3, "Name is too short")
    .max(20, "Name is too long")
    .trim(),
  password: z.string()
    .min(7, "Minimum of 7 character length")
    .max(15, "Maximum of 15 character length")
    .trim()
});

const loginSchema = z.object({
  email: z.email("Invalid Email").trim(),
  password: z.string("Password cannot be empty").trim()
})

export const register = async ({ input, context }: ServiceProps) => {
  try {
    const data = registerSchema.safeParse(input);
    if (data.success) {
      const {email, name, password} = data.data;

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = {email, name, hashedPassword};
      const userCreated = await context.db.user.create({data: user});

      return userCreated;
    } else {
      console.error("Validation errors: ", data.error.issues);
      throw new ValidationError(data.error.issues);
    }
  } catch (error) {
    console.log("Error while creating user: ", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("Email already in use");
    }
    throw error;
  }
};

export const login = async ({ input, context}: ServiceProps) => {
  const data = loginSchema.safeParse(input);
  if (data.error) {
    console.error("Validation error - ", data.error);
    throw new ValidationError(data.error.issues);
  }

  const {email, password} = data.data;
  const user = await context.db.user.findFirst({where: {email}});
  if (!user) {
    console.error("Invalid email or password");
    throw new Error(`Invalid email or password`);
  }
  const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
  if (isValidPassword) {
    return user;
  }
  throw new Error("Invalid email or password");
};