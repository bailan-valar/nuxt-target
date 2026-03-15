import type { PrismaClient } from '@prisma/client'

/**
 * 检查设置父folder是否会创建循环依赖
 *
 * @param folderId 要设置父folder的folder ID（新建folder时为 null）
 * @param parentId 父folder ID
 * @param prisma Prisma 客户端
 * @returns 是否会创建循环依赖
 *
 * @example
 * // 新建folder时检查
 * const hasCycle = await wouldCreateFolderCycle(null, 'parent-id', prisma)
 *
 * // 编辑folder时检查
 * const hasCycle = await wouldCreateFolderCycle('folder-id', 'new-parent-id', prisma)
 */
export async function wouldCreateFolderCycle(
  folderId: string | null,
  parentId: string | null,
  prisma: PrismaClient
): Promise<boolean> {
  // 如果没有父folder，不会创建循环
  if (!parentId) return false

  // 如果folder是自己的父folder，这是循环
  if (folderId === parentId) return true

  // 获取父folder的所有祖先
  const visited = new Set<string>()
  let currentId: string | null = parentId

  while (currentId) {
    // 如果当前节点就是folder本身，会创建循环
    if (currentId === folderId) return true

    // 如果已经访问过这个节点，存在循环
    if (visited.has(currentId)) return true

    visited.add(currentId)

    // 查找当前节点的父节点
    const parent = await prisma.folder.findUnique({
      where: { id: currentId },
      select: { parentId: true }
    })

    currentId = parent?.parentId || null
  }

  return false
}

/**
 * 获取folder的所有祖先ID（从最近到最远）
 *
 * @param folderId folder ID
 * @param prisma Prisma 客户端
 * @returns 祖先ID数组
 *
 * @example
 * const ancestors = await getFolderAncestorIds('folder-id', prisma)
 * // 返回: ['parent-id', 'grandparent-id']
 */
export async function getFolderAncestorIds(
  folderId: string,
  prisma: PrismaClient
): Promise<string[]> {
  const ancestors: string[] = []
  let currentId: string | null = folderId

  while (currentId) {
    const folder = await prisma.folder.findUnique({
      where: { id: currentId },
      select: { parentId: true }
    })

    currentId = folder?.parentId || null
    if (currentId) {
      ancestors.push(currentId)
    }
  }

  return ancestors
}

/**
 * 获取folder的所有后代ID
 *
 * @param folderId folder ID
 * @param prisma Prisma 客户端
 * @returns 后代ID数组
 *
 * @example
 * const descendants = await getFolderDescendantIds('folder-id', prisma)
 */
export async function getFolderDescendantIds(
  folderId: string,
  prisma: PrismaClient
): Promise<string[]> {
  const descendants: string[] = []
  const toProcess: string[] = [folderId]

  while (toProcess.length > 0) {
    const currentId = toProcess.pop()!

    const children = await prisma.folder.findMany({
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
 * 计算folder的深度（根folder深度为0）
 *
 * @param folderId folder ID
 * @param prisma Prisma 客户端
 * @returns folder深度
 *
 * @example
 * const depth = await getFolderDepth('folder-id', prisma)
 */
export async function getFolderDepth(
  folderId: string,
  prisma: PrismaClient
): Promise<number> {
  const ancestors = await getFolderAncestorIds(folderId, prisma)
  return ancestors.length
}

/**
 * 验证父folder是否属于指定用户
 *
 * @param parentId 父folder ID
 * @param userId 用户 ID
 * @param prisma Prisma 客户端
 * @returns 父folder是否属于用户
 */
export async function isParentFolderOwnedByUser(
  parentId: string,
  userId: string,
  prisma: PrismaClient
): Promise<boolean> {
  const parentFolder = await prisma.folder.findUnique({
    where: { id: parentId },
    select: { userId: true }
  })

  return parentFolder?.userId === userId
}

/**
 * 构建folder树形结构
 *
 * @param userId 用户 ID
 * @param prisma Prisma 客户端
 * @param options 选项
 * @returns 树形结构的folder数组
 *
 * @example
 * const tree = await buildFolderTree('user-id', prisma, {
 *   types: ['GROUP', 'PROJECT'],
 *   includeGoals: true,
 *   maxDepth: 10
 * })
 */
export async function buildFolderTree(
  userId: string,
  prisma: PrismaClient,
  options?: {
    types?: string[]
    includeGoals?: boolean
    maxDepth?: number
  }
): Promise<any[]> {
  const maxDepth = options?.maxDepth ?? 20 // 默认最大深度20层

  const folders = await prisma.folder.findMany({
    where: {
      userId,
      ...(options?.types && { type: { in: options.types } })
    },
    include: {
      ...(options?.includeGoals && {
        goals: {
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      }),
      _count: {
        select: {
          children: true,
          goals: true
        }
      }
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
  })

  // 构建ID到folder的映射
  const folderMap = new Map()
  const depthMap = new Map<string, number>() // 记录每个folder的深度
  const rootFolders: any[] = []

  folders.forEach((folder) => {
    folderMap.set(folder.id, { ...folder, children: [] })
  })

  // 计算每个folder的深度并构建树
  folders.forEach((folder) => {
    const folderWithChildren = folderMap.get(folder.id)

    // 计算深度
    let depth = 0
    if (folder.parentId) {
      const parentDepth = depthMap.get(folder.parentId) ?? 0
      depth = parentDepth + 1
    }
    depthMap.set(folder.id, depth)

    // 只添加未超过最大深度的folder
    if (depth <= maxDepth) {
      if (folder.parentId) {
        const parent = folderMap.get(folder.parentId)
        if (parent) {
          parent.children.push(folderWithChildren)
        }
      } else {
        rootFolders.push(folderWithChildren)
      }
    }
  })

  return rootFolders
}
