import { getPrisma } from '~/server/utils/db'
import { getAncestorIds } from '~/server/utils/goal-hierarchy'

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

  // 验证目标是否存在且属于当前用户
  const goal = await prisma.goal.findUnique({
    where: { id: goalId }
  })

  if (!goal) {
    throw createError({ statusCode: 404, message: '目标不存在' })
  }

  if (goal.userId !== userId) {
    throw createError({ statusCode: 403, message: '无权访问该目标' })
  }

  // 获取祖先ID
  const ancestorIds = await getAncestorIds(goalId, prisma)

  // 如果没有祖先，返回空数组
  if (ancestorIds.length === 0) {
    return { success: true, data: [] }
  }

  // 获取所有祖先的详细信息
  const ancestors = await prisma.goal.findMany({
    where: {
      id: { in: ancestorIds }
    },
    select: {
      id: true,
      title: true,
      status: true,
      periodType: true,
      periodValue: true
    }
  })

  // 按照从根到当前的顺序排列
  const ancestorMap = new Map(ancestors.map(a => [a.id, a]))
  const orderedAncestors = ancestorIds.reverse().map(id => ancestorMap.get(id)).filter(Boolean)

  return {
    success: true,
    data: orderedAncestors
  }
})
