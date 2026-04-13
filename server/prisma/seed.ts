import bcrypt from "bcrypt";
import "dotenv/config";
import {PrismaPg} from "@prisma/adapter-pg";

import {PrismaClient} from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!
})

const prisma = new PrismaClient({adapter});

const main = async () => {

  const user1Hash = await bcrypt.hash("Test111", 10);
  const user2Hash = await bcrypt.hash("Test222", 10);
  const user3Hash = await bcrypt.hash("Test333", 10);

  await prisma.$transaction([
    prisma.user.create({data: {
      email: "test1@gmail.com",
      name: "Test1",
      hashedPassword: user1Hash
    }}),
    prisma.user.create({data: {
      email: "test2@gmail.com",
      name: "Test2",
      hashedPassword: user2Hash
    }}),
    prisma.user.create({data: {
      email: "test3@gmail.com",
      name: "Test3",
      hashedPassword: user3Hash
    }})
  ])
}

main().catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })