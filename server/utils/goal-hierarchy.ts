import type { PrismaClient } from '@prisma/client'

/**
 * 检查设置父目标是否会创建循环依赖
 *
 * @param goalId 要设置父目标的目标ID（新建目标时为 null）
 * @param parentId 父目标ID
 * @param prisma Prisma 客户端
 * @returns 是否会创建循环依赖
 *
 * @example
 * // 新建目标时检查
 * const hasCycle = await wouldCreateCycle(null, 'parent-id', prisma)
 *
 * // 编辑目标时检查
 * const hasCycle = await wouldCreateCycle('goal-id', 'new-parent-id', prisma)
 */
export async function wouldCreateCycle(
  goalId: string | null,
  parentId: string | null,
  prisma: PrismaClient
): Promise<boolean> {
  // 如果没有父目标，不会创建循环
  if (!parentId) return false

  // 如果目标是自己的父目标，这是循环
  if (goalId === parentId) return true

  // 获取父目标的所有祖先
  const visited = new Set<string>()
  let currentId: string | null = parentId

  while (currentId) {
    // 如果当前节点就是目标本身，会创建循环
    if (currentId === goalId) return true

    // 如果已经访问过这个节点，存在循环
    if (visited.has(currentId)) return true

    visited.add(currentId)

    // 查找当前节点的父节点
    const parent = await prisma.goal.findUnique({
      where: { id: currentId },
      select: { parentId: true }
    })

    currentId = parent?.parentId || null
  }

  return false
}

/**
 * 获取目标的所有祖先ID（从最近到最远）
 *
 * @param goalId 目标ID
 * @param prisma Prisma 客户端
 * @returns 祖先ID数组
 *
 * @example
 * const ancestors = await getAncestorIds('goal-id', prisma)
 * // 返回: ['parent-id', 'grandparent-id']
 */
export async function getAncestorIds(
  goalId: string,
  prisma: PrismaClient
): Promise<string[]> {
  const ancestors: string[] = []
  let currentId: string | null = goalId

  while (currentId) {
    const goal = await prisma.goal.findUnique({
      where: { id: currentId },
      select: { parentId: true }
    })

    currentId = goal?.parentId || null
    if (currentId) {
      ancestors.push(currentId)
    }
  }

  return ancestors
}

/**
 * 获取目标的所有后代ID
 *
 * @param goalId 目标ID
 * @param prisma Prisma 客户端
 * @returns 后代ID数组
 *
 * @example
 * const descendants = await getDescendantIds('goal-id', prisma)
 */
export async function getDescendantIds(
  goalId: string,
  prisma: PrismaClient
): Promise<string[]> {
  const descendants: string[] = []
  const toProcess: string[] = [goalId]

  while (toProcess.length > 0) {
    const currentId = toProcess.pop()!

    const children = await prisma.goal.findMany({
      where: { parentId: currentId },
      select: { id: true }
    })

    for (const child of children) {
      descendants.push(child.id)
      toProcess.push(child.id)
    }
  }

  return descendants
}

/**
 * 计算目标的深度（根目标深度为0）
 *
 * @param goalId 目标ID
 * @param prisma Prisma 客户端
 * @returns 目标深度
 *
 * @example
 * const depth = await getGoalDepth('goal-id', prisma)
 */
export async function getGoalDepth(
  goalId: string,
  prisma: PrismaClient
): Promise<number> {
  const ancestors = await getAncestorIds(goalId, prisma)
  return ancestors.length
}

/**
 * 验证父目标是否属于指定用户
 *
 * @param parentId 父目标ID
 * @param userId 用户ID
 * @param prisma Prisma 客户端
 * @returns 父目标是否属于用户
 */
export async function isParentGoalOwnedByUser(
  parentId: string,
  userId: string,
  prisma: PrismaClient
): Promise<boolean> {
  const parentGoal = await prisma.goal.findUnique({
    where: { id: parentId },
    select: { userId: true }
  })

  return parentGoal?.userId === userId
}
