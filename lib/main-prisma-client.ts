import { PrismaClient } from "~~/prisma/main/client";
import { withAccelerate } from "@prisma/extension-accelerate"
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

// const getPrisma = () => new PrismaClient().$extends(withAccelerate());
const getPrisma = () => new PrismaClient({ adapter }).$extends(withAccelerate());

const globalForMainDBPrismaClient = global as unknown as {
  MainDBPrismaClient: ReturnType<typeof getPrisma>;
};

export const MainDBPrismaClient =
  globalForMainDBPrismaClient.MainDBPrismaClient || getPrisma();

if (process.env.NODE_ENV !== "production")
  globalForMainDBPrismaClient.MainDBPrismaClient = MainDBPrismaClient;