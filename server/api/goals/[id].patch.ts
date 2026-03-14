import { getPrisma } from '~/server/utils/db'
import { updateGoalSchema, goalStatusSchema } from '~/server/validations/goal'
import { wouldCreateCycle } from '~/server/utils/goal-hierarchy'

const updateSchema = updateGoalSchema.and(
  z.object({
    status: goalStatusSchema.optional()
  })
)

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id
  if (!userId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const goalId = getRouterParam(event, 'id')
  if (!goalId) {
    throw createError({ statusCode: 400, message: 'Goal ID is required' })
  }

  const body = await readBody(event)
  const data = updateSchema.parse(body)

  const prisma = getPrisma()

  // 验证目标是否属于当前用户
  const existingGoal = await prisma.goal.findUnique({
    where: { id: goalId }
  })

  if (!existingGoal) {
    throw createError({ statusCode: 404, message: '目标不存在' })
  }

  if (existingGoal.userId !== userId) {
    throw createError({ statusCode: 403, message: '无权修改该目标' })
  }

  // 验证父目标
  if (data.parentId !== undefined) {
    // 不能设置自己为父目标
    if (data.parentId === goalId) {
      throw createError({ statusCode: 400, message: '目标不能设置自己为父目标' })
    }

    // 如果有父目标，进行验证
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
      const hasCycle = await wouldCreateCycle(goalId, data.parentId, prisma)
      if (hasCycle) {
        throw createError({ statusCode: 400, message: '不能创建循环依赖关系' })
      }
    }
  }

  // 更新目标
  const goal = await prisma.goal.update({
    where: { id: goalId },
    data: {
      ...(data.group !== undefined && { group: data.group }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.periodType !== undefined && { periodType: data.periodType }),
      ...(data.periodValue !== undefined && { periodValue: data.periodValue }),
      ...(data.parentId !== undefined && { parentId: data.parentId })
    }
  })

  return { success: true, data: goal }
})
