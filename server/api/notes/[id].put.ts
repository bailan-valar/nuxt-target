import { getPrisma } from '~/server/utils/db'
import { z } from 'zod'
import { serializeTags, normalizeTags } from '~/server/utils/tags'

const updateNoteSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(200, '标题最多200个字符').optional(),
  content: z.string().optional(),
  folderId: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  isPinned: z.boolean().optional(),
  sortOrder: z.number().optional()
})

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.user?.id
    if (!userId) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: '笔记ID不能为空'
      })
    }

    const body = await readBody(event)
    const validatedData = updateNoteSchema.parse(body)

    const prisma = getPrisma()

    // 验证笔记是否存在且属于当前用户
    const existingNote = await prisma.note.findFirst({
      where: {
        id,
        userId
      }
    })

    if (!existingNote) {
      throw createError({
        statusCode: 404,
        statusMessage: '笔记不存在'
      })
    }

    // 如果指定了文件夹，验证文件夹是否存在且属于当前用户
    if (validatedData.folderId !== undefined && validatedData.folderId !== null) {
      const folder = await prisma.folder.findUnique({
        where: { id: validatedData.folderId }
      })

      if (!folder || folder.userId !== userId) {
        throw createError({
          statusCode: 400,
          statusMessage: '文件夹不存在或无权访问'
        })
      }
    }

    // 准备更新数据，处理 tags 序列化
    const updateData: any = {}
    if (validatedData.title !== undefined) updateData.title = validatedData.title
    if (validatedData.content !== undefined) updateData.content = validatedData.content
    if (validatedData.folderId !== undefined) updateData.folderId = validatedData.folderId
    if (validatedData.isPinned !== undefined) updateData.isPinned = validatedData.isPinned
    if (validatedData.sortOrder !== undefined) updateData.sortOrder = validatedData.sortOrder
    if (validatedData.tags !== undefined) {
      updateData.tags = serializeTags(normalizeTags(validatedData.tags))
    }

    const note = await prisma.note.update({
      where: { id },
      data: updateData,
      include: {
        folder: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // 返回时反序列化 tags
    return {
      success: true,
      data: {
        ...note,
        tags: note.tags ? JSON.parse(note.tags) : []
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError && error.errors && error.errors.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: error.errors[0].message
      })
    }

    console.error('更新笔记失败:', error)
    throw error
  }
})
