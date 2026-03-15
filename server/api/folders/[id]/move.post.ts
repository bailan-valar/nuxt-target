import { getPrisma } from '~/server/utils/db'
import { moveFolderSchema } from '~/server/validations/folder'
import { wouldCreateFolderCycle } from '~/server/utils/folder-hierarchy'

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id
  if (!userId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const folderId = getRouterParam(event, 'id')
  if (!folderId) {
    throw createError({ statusCode: 400, message: 'Folder ID is required' })
  }

  const body = await readBody(event)
  const data = moveFolderSchema.parse(body)

  const prisma = getPrisma()

  // 验证folder是否属于当前用户
  const existingFolder = await prisma.folder.findUnique({
    where: { id: folderId }
  })

  if (!existingFolder) {
    throw createError({ statusCode: 404, message: '文件夹不存在' })
  }

  if (existingFolder.userId !== userId) {
    throw createError({ statusCode: 403, message: '无权移动该文件夹' })
  }

  // 验证新父folder
  if (data.newParentId) {
    if (data.newParentId === folderId) {
      throw createError({
        statusCode: 400,
        message: '文件夹不能移动到自己下面'
      })
    }

    const parentFolder = await prisma.folder.findUnique({
      where: { id: data.newParentId }
    })

    if (!parentFolder) {
      throw createError({ statusCode: 400, message: '目标父文件夹不存在' })
    }

    if (parentFolder.userId !== userId) {
      throw createError({ statusCode: 403, message: '无权移动到该文件夹' })
    }

    // 检查循环依赖
    const hasCycle = await wouldCreateFolderCycle(
      folderId,
      data.newParentId,
      prisma
    )
    if (hasCycle) {
      throw createError({ statusCode: 400, message: '移动会造成循环依赖' })
    }
  }

  // 移动folder
  const folder = await prisma.folder.update({
    where: { id: folderId },
    data: {
      parentId: data.newParentId,
      ...(data.newSortOrder !== undefined && { sortOrder: data.newSortOrder })
    }
  })

  return { success: true, data: folder }
})
