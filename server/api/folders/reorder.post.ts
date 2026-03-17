import { z } from 'zod'
import { getPrisma } from '~/server/utils/db'

/**
 * 批量更新文件夹排序的验证 Schema
 */
const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().cuid(),
      sortOrder: z.number().int().min(0)
    })
  )
})

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id
  if (!userId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  try {
    const body = await readBody(event)
    const { items } = reorderSchema.parse(body)

    const prisma = getPrisma()

    // 验证所有文件夹是否属于当前用户
    const folderIds = items.map(item => item.id)
    const folders = await prisma.folder.findMany({
      where: {
        id: { in: folderIds }
      }
    })

    // 检查是否有不属于当前用户的文件夹
    const unauthorizedFolders = folders.filter(f => f.userId !== userId)
    if (unauthorizedFolders.length > 0) {
      throw createError({ statusCode: 403, message: '无权修改某些文件夹' })
    }

    // 检查是否所有文件夹都存在
    if (folders.length !== folderIds.length) {
      throw createError({ statusCode: 404, message: '某些文件夹不存在' })
    }

    // 批量更新排序
    await prisma.$transaction(
      items.map(item =>
        prisma.folder.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder }
        })
      )
    )

    return { success: true, message: '排序更新成功' }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: '参数验证失败',
        data: error.errors
      })
    }
    throw error
  }
})
