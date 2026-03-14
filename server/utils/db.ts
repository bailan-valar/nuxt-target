import { MainDBPrismaClient } from '~~/lib/main-prisma-client'

let prisma: MainDBPrismaClient

export function getPrisma() {
  if (!prisma) {
    prisma = MainDBPrismaClient
  }
  return prisma
}
