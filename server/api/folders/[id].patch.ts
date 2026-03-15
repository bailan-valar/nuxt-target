import { getPrisma } from '~/server/utils/db'
import { updateFolderSchema } from '~/server/validations/folder'
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
  const data = updateFolderSchema.parse(body)

  const prisma = getPrisma()

  // 验证folder是否属于当前用户
  const existingFolder = await prisma.folder.findUnique({
    where: { id: folderId }
  })

  if (!existingFolder) {
    throw createError({ statusCode: 404, message: '文件夹不存在' })
  }

  if (existingFolder.userId !== userId) {
    throw createError({ statusCode: 403, message: '无权修改该文件夹' })
  }

  // 验证父folder
  if (data.parentId !== undefined) {
    if (data.parentId === folderId) {
      throw createError({
        statusCode: 400,
        message: '文件夹不能设置自己为父文件夹'
      })
    }

    if (data.parentId) {
      const parentFolder = await prisma.folder.findUnique({
        where: { id: data.parentId }
      })

      if (!parentFolder) {
        throw createError({ statusCode: 400, message: '父文件夹不存在' })
      }

      if (parentFolder.userId !== userId) {
        throw createError({ statusCode: 403, message: '无权使用该父文件夹' })
      }

      // 检查循环依赖
      const hasCycle = await wouldCreateFolderCycle(
        folderId,
        data.parentId,
        prisma
      )
      if (hasCycle) {
        throw createError({ statusCode: 400, message: '不能创建循环依赖关系' })
      }
    }
  }

  // 更新folder
  const folder = await prisma.folder.update({
    where: { id: folderId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.icon !== undefined && { icon: data.icon }),
      ...(data.color !== undefined && { color: data.color }),
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      ...(data.parentId !== undefined && { parentId: data.parentId })
    }
  })

  return { success: true, data: folder }
})
