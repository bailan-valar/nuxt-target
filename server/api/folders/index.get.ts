import { getPrisma } from '~/server/utils/db'
import { folderQuerySchema } from '~/server/validations/folder'
import { buildFolderTree } from '~/server/utils/folder-hierarchy'

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id
  if (!userId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const query = getQuery(event)
  const { type, parentId, includeChildren, includeGoals, expandAll } =
    folderQuerySchema.parse(query)

  const prisma = getPrisma()

  // 如果请求树形结构
  if (expandAll) {
    const tree = await buildFolderTree(userId, prisma, {
      types: type ? [type] : undefined,
      includeGoals: includeGoals ?? false
    })
    return { success: true, data: tree }
  }

  // 普通列表查询
  const folders = await prisma.folder.findMany({
    where: {
      userId,
      ...(type && { type }),
      ...(parentId !== undefined && { parentId })
    },
    include: {
      ...(includeChildren && {
        children: {
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
        }
      }),
      ...(includeGoals && {
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

  return { success: true, data: folders }
})
