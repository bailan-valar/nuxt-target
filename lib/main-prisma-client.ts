import { PrismaClient } from "~/prisma/main/client";
import { PrismaD1 } from '@prisma/adapter-d1'

/**
 * 获取 Prisma 客户端实例
 * 根据运行环境自动选择合适的配置
 */
const getPrisma = () => {
  // Cloudflare Workers/Pages 环境 - 使用 D1 binding
  // @ts-ignore - Cloudflare 环境变量
  if (typeof globalThis.process?.env?.CF_PAGES === 'undefined' &&
      typeof (globalThis as any).env !== 'undefined') {
    const adapter = new PrismaD1((globalThis as any).env.DB)
    return new PrismaClient({ adapter })
  }

  // 本地开发环境 - 使用 SQLite 文件，不需要 adapter
  if (process.env.DATABASE_URL) {
    return new PrismaClient()
  }

  throw new Error('No database configuration found. Please set DATABASE_URL for local development.')
}

const globalForMainDBPrismaClient = global as unknown as {
  MainDBPrismaClient: ReturnType<typeof getPrisma>;
};

export const MainDBPrismaClient =
  globalForMainDBPrismaClient.MainDBPrismaClient || getPrisma();

// 在开发环境缓存到 global，避免热重载时创建多个实例
if (process.env.NODE_ENV !== "production") {
  globalForMainDBPrismaClient.MainDBPrismaClient = MainDBPrismaClient;
}

// 导出获取函数供服务器端使用
export { getPrisma }
