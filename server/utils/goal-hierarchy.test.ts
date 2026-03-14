import { describe, it, expect, beforeEach, vi } from 'vitest'
import { wouldCreateCycle, getAncestorIds, getDescendantIds, getGoalDepth, isParentGoalOwnedByUser } from './goal-hierarchy'
import { PrismaClient } from '@prisma/client'

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn()
}))

describe('goal-hierarchy 工具函数', () => {
  let prisma: any

  beforeEach(() => {
    prisma = {
      goal: {
        findUnique: vi.fn(),
        findMany: vi.fn()
      }
    }
  })

  describe('wouldCreateCycle', () => {
    it('应该返回 false 当没有 parentId 时', async () => {
      const result = await wouldCreateCycle(null, null, prisma)
      expect(result).toBe(false)
    })

    it('应该返回 true 当目标是自己的父目标时', async () => {
      const result = await wouldCreateCycle('goal1', 'goal1', prisma)
      expect(result).toBe(true)
    })

    it('应该返回 true 当创建循环依赖时', async () => {
      // goal1 -> goal2 -> goal3
      // 尝试设置 goal3 的父目标为 goal1
      prisma.goal.findUnique
        .mockResolvedValueOnce({ parentId: 'goal2' })  // goal3 的父节点是 goal2
        .mockResolvedValueOnce({ parentId: 'goal1' })  // goal2 的父节点是 goal1

      const result = await wouldCreateCycle('goal3', 'goal1', prisma)
      expect(result).toBe(true)
    })

    it('应该返回 false 当没有循环依赖时', async () => {
      // goal1 -> goal2 -> goal3
      // 尝试设置 goal4 的父目标为 goal1
      prisma.goal.findUnique
        .mockResolvedValueOnce({ parentId: null })  // goal1 没有父节点

      const result = await wouldCreateCycle('goal4', 'goal1', prisma)
      expect(result).toBe(false)
    })

    it('应该检测已存在的循环', async () => {
      // goal1 -> goal2 -> goal3 -> goal2 (已存在循环)
      prisma.goal.findUnique
        .mockResolvedValueOnce({ parentId: 'goal2' })
        .mockResolvedValueOnce({ parentId: 'goal3' })
        .mockResolvedValueOnce({ parentId: 'goal2' })

      const result = await wouldCreateCycle('goal4', 'goal1', prisma)
      expect(result).toBe(true)
    })
  })

  describe('getAncestorIds', () => {
    it('应该返回空数组当目标没有父节点时', async () => {
      prisma.goal.findUnique.mockResolvedValue({ parentId: null })

      const result = await getAncestorIds('goal1', prisma)
      expect(result).toEqual([])
    })

    it('应该返回所有祖先ID', async () => {
      // goal3 -> goal2 -> goal1
      prisma.goal.findUnique
        .mockResolvedValueOnce({ parentId: 'goal2' })  // goal3 的父节点
        .mockResolvedValueOnce({ parentId: 'goal1' })  // goal2 的父节点
        .mockResolvedValueOnce({ parentId: null })     // goal1 的父节点

      const result = await getAncestorIds('goal3', prisma)
      expect(result).toEqual(['goal2', 'goal1'])
    })

    it('应该只返回从最近到最远的祖先', async () => {
      // goal4 -> goal3 -> goal2 -> goal1
      prisma.goal.findUnique
        .mockResolvedValueOnce({ parentId: 'goal3' })
        .mockResolvedValueOnce({ parentId: 'goal2' })
        .mockResolvedValueOnce({ parentId: 'goal1' })
        .mockResolvedValueOnce({ parentId: null })

      const result = await getAncestorIds('goal4', prisma)
      expect(result).toEqual(['goal3', 'goal2', 'goal1'])
    })
  })

  describe('getDescendantIds', () => {
    it('应该返回空数组当目标没有子节点时', async () => {
      prisma.goal.findMany.mockResolvedValue([])

      const result = await getDescendantIds('goal1', prisma)
      expect(result).toEqual([])
    })

    it('应该返回所有后代ID（单层级）', async () => {
      prisma.goal.findMany.mockResolvedValue([
        { id: 'child1' },
        { id: 'child2' }
      ])

      const result = await getDescendantIds('parent1', prisma)
      expect(result).toEqual(['child1', 'child2'])
    })

    it('应该返回所有后代ID（多层级）', async () => {
      // parent1 -> child1, child2
      // child1 -> grandchild1, grandchild2
      prisma.goal.findMany
        .mockResolvedValueOnce([
          { id: 'child1' },
          { id: 'child2' }
        ])
        .mockResolvedValueOnce([
          { id: 'grandchild1' },
          { id: 'grandchild2' }
        ])
        .mockResolvedValue([])  // child2 没有子节点

      const result = await getDescendantIds('parent1', prisma)
      expect(result).toContain('child1')
      expect(result).toContain('child2')
      expect(result).toContain('grandchild1')
      expect(result).toContain('grandchild2')
    })
  })

  describe('getGoalDepth', () => {
    it('应该返回 0 当目标是根节点时', async () => {
      prisma.goal.findUnique.mockResolvedValue({ parentId: null })

      const result = await getGoalDepth('goal1', prisma)
      expect(result).toBe(0)
    })

    it('应该返回正确的深度', async () => {
      // goal3 -> goal2 -> goal1
      prisma.goal.findUnique
        .mockResolvedValueOnce({ parentId: 'goal2' })
        .mockResolvedValueOnce({ parentId: 'goal1' })
        .mockResolvedValueOnce({ parentId: null })

      const result = await getGoalDepth('goal3', prisma)
      expect(result).toBe(2)
    })
  })

  describe('isParentGoalOwnedByUser', () => {
    it('应该返回 true 当父目标属于用户时', async () => {
      prisma.goal.findUnique.mockResolvedValue({
        userId: 'user1'
      })

      const result = await isParentGoalOwnedByUser('parent1', 'user1', prisma)
      expect(result).toBe(true)
    })

    it('应该返回 false 当父目标不属于用户时', async () => {
      prisma.goal.findUnique.mockResolvedValue({
        userId: 'user2'
      })

      const result = await isParentGoalOwnedByUser('parent1', 'user1', prisma)
      expect(result).toBe(false)
    })

    it('应该返回 false 当父目标不存在时', async () => {
      prisma.goal.findUnique.mockResolvedValue(null)

      const result = await isParentGoalOwnedByUser('parent1', 'user1', prisma)
      expect(result).toBe(false)
    })
  })
})
