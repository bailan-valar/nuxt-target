import { getPrisma } from '~/server/utils/db'
import { createGoalSchema } from '~/server/validations/goal'
import { wouldCreateCycle } from '~/server/utils/goal-hierarchy'

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id
  if (!userId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const body = await readBody(event)
  const data = createGoalSchema.parse(body)

  const prisma = getPrisma()

  // 验证父目标
  if (data.parentId) {
    // 检查父目标是否存在
    const parentGoal = await prisma.goal.findUnique({
      where: { id: data.parentId }
    })

    if (!parentGoal) {
      throw createError({ statusCode: 400, message: '父目标不存在' })
    }

    // 检查父目标是否属于当前用户
    if (parentGoal.userId !== userId) {
      throw createError({ statusCode: 403, message: '无权使用该父目标' })
    }

    // 检查是否会造成循环依赖
    const hasCycle = await wouldCreateCycle(null, data.parentId, prisma)
    if (hasCycle) {
      throw createError({ statusCode: 400, message: '不能创建循环依赖关系' })
    }
  }

  const goal = await prisma.goal.create({
    data: {
      group: data.group,
      title: data.title,
      description: data.description,
      periodType: data.periodType,
      periodValue: data.periodValue,
      parentId: data.parentId,
      userId
    }
  })

  return { success: true, data: goal }
})
