import { getPrisma } from '~/server/utils/db'
import { z } from 'zod'

const createNoteSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(200, '标题最多200个字符'),
  content: z.string().optional(),
  folderId: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
  isPinned: z.boolean().default(false)
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

    const body = await readBody(event)
    const validatedData = createNoteSchema.parse(body)

    const prisma = getPrisma()

    // 如果指定了文件夹，验证文件夹是否存在且属于当前用户
    if (validatedData.folderId) {
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

    // 获取用户当前最大的sortOrder
    const maxSortOrder = await prisma.note.findFirst({
      where: {
        userId: userId,
        folderId: validatedData.folderId || null
      },
      orderBy: {
        sortOrder: 'desc'
      },
      select: {
        sortOrder: true
      }
    })

    const nextSortOrder = (maxSortOrder?.sortOrder ?? -1) + 1

    const note = await prisma.note.create({
      data: {
        ...validatedData,
        userId: userId,
        sortOrder: nextSortOrder
      },
      include: {
        folder: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return {
      success: true,
      data: note
    }
  } catch (error) {
    if (error instanceof z.ZodError && error.errors && error.errors.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: error.errors[0].message
      })
    }

    console.error('创建笔记失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '创建笔记失败'
    })
  }
})
