import { MainDBPrismaClient } from '~/lib/main-prisma-client'

let prisma: ReturnType<typeof MainDBPrismaClient> | undefined

export function getPrisma() {
  if (!prisma) {
    prisma = MainDBPrismaClient
  }
  return prisma
}
