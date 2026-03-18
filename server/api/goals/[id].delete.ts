import { getPrisma } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id
  if (!userId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const goalId = getRouterParam(event, 'id')
  if (!goalId) {
    throw createError({ statusCode: 400, message: 'Goal ID is required' })
  }

  const prisma = getPrisma()

  // 验证目标是否属于当前用户
  const existingGoal = await prisma.goal.findUnique({
    where: { id: goalId },
    include: {
      children: {
        select: { id: true }
      }
    }
  })

  if (!existingGoal) {
    throw createError({ statusCode: 404, message: '目标不存在' })
  }

  if (existingGoal.userId !== userId) {
    throw createError({ statusCode: 403, message: '无权删除该目标' })
  }

  // 检查是否有子目标
  if (existingGoal.children.length > 0) {
    throw createError({
      statusCode: 400,
      message: '无法删除包含子目标的目标,请先删除或移动所有子目标'
    })
  }

  // 删除目标
  await prisma.goal.delete({
    where: { id: goalId }
  })

  return { success: true }
})
