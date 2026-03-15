import { PrismaClient } from "~/prisma/main/client";
import { withAccelerate } from "@prisma/extension-accelerate"
import { PrismaPg } from '@prisma/adapter-pg'

// 验证数据库 URL 存在
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

// const getPrisma = () => new PrismaClient().$extends(withAccelerate());
const getPrisma = () => new PrismaClient({ adapter }).$extends(withAccelerate());

const globalForMainDBPrismaClient = global as unknown as {
  MainDBPrismaClient: ReturnType<typeof getPrisma>;
};

export const MainDBPrismaClient =
  globalForMainDBPrismaClient.MainDBPrismaClient || getPrisma();

// 在开发环境缓存到 global，避免热重载时创建多个实例
if (process.env.NODE_ENV !== "production") {
  globalForMainDBPrismaClient.MainDBPrismaClient = MainDBPrismaClient;
}