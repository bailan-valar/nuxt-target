import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { $fetch, createTestDatabase, cleanupTestDatabase } from '../test-utils'

describe('Goals API - 父目标功能集成测试', () => {
  let testDb: any
  let userId: string
  let authToken: string

  beforeAll(async () => {
    testDb = await createTestDatabase()
    // 创建测试用户并获取 token
    const user = await testDb.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashedpassword'
      }
    })
    userId = user.id
    authToken = `Bearer ${generateTestToken(user.id)}`
  })

  afterAll(async () => {
    await cleanupTestDatabase(testDb)
  })

  beforeEach(async () => {
    // 清理测试数据
    await testDb.goal.deleteMany({})
  })

  describe('POST /api/goals - 创建目标', () => {
    it('应该成功创建带父目标的目标', async () => {
      // 先创建父目标
      const parentGoal = await testDb.goal.create({
        data: {
          userId,
          title: '父目标',
          status: 'active'
        }
      })

      // 创建子目标
      const response = await $fetch('/api/goals', {
        method: 'POST',
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json'
        },
        body: {
          title: '子目标',
          parentId: parentGoal.id
        }
      })

      expect(response.success).toBe(true)
      expect(response.data.parentId).toBe(parentGoal.id)
    })

    it('应该拒绝创建时设置不存在的父目标', async () => {
      const response = await $fetch('/api/goals', {
        method: 'POST',
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json'
        },
        body: {
          title: '子目标',
          parentId: 'nonexistent-id'
        }
      }).catch(e => e.data)

      expect(response.success).toBe(false)
      expect(response.error).toContain('父目标不存在')
    })

    it('应该拒绝创建时设置其他用户的父目标', async () => {
      // 创建另一个用户
      const otherUser = await testDb.user.create({
        data: {
          email: 'other@example.com',
          password: 'hashedpassword'
        }
      })

      // 创建其他用户的目标
      const otherGoal = await testDb.goal.create({
        data: {
          userId: otherUser.id,
          title: '其他用户的目标'
        }
      })

      const response = await $fetch('/api/goals', {
        method: 'POST',
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json'
        },
        body: {
          title: '子目标',
          parentId: otherGoal.id
        }
      }).catch(e => e.data)

      expect(response.success).toBe(false)
      expect(response.error).toContain('无权使用该父目标')
    })

    it('应该成功创建不带父目标的目标', async () => {
      const response = await $fetch('/api/goals', {
        method: 'POST',
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json'
        },
        body: {
          title: '独立目标'
        }
      })

      expect(response.success).toBe(true)
      expect(response.data.parentId).toBe(null)
    })
  })

  describe('PATCH /api/goals/:id - 更新目标', () => {
    it('应该成功更新目标的父目标', async () => {
      const goal1 = await testDb.goal.create({
        data: { userId, title: '目标1', status: 'active' }
      })
      const goal2 = await testDb.goal.create({
        data: { userId, title: '目标2', status: 'active' }
      })

      const response = await $fetch(`/api/goals/${goal2.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json'
        },
        body: {
          parentId: goal1.id
        }
      })

      expect(response.success).toBe(true)
      expect(response.data.parentId).toBe(goal1.id)
    })

    it('应该拒绝设置自己为父目标', async () => {
      const goal = await testDb.goal.create({
        data: { userId, title: '目标', status: 'active' }
      })

      const response = await $fetch(`/api/goals/${goal.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json'
        },
        body: {
          parentId: goal.id
        }
      }).catch(e => e.data)

      expect(response.success).toBe(false)
      expect(response.error).toContain('目标不能设置自己为父目标')
    })

    it('应该拒绝创建循环依赖', async () => {
      // 创建层级: goal1 -> goal2 -> goal3
      const goal1 = await testDb.goal.create({
        data: { userId, title: '目标1', status: 'active' }
      })
      const goal2 = await testDb.goal.create({
        data: { userId, title: '目标2', parentId: goal1.id, status: 'active' }
      })
      const goal3 = await testDb.goal.create({
        data: { userId, title: '目标3', parentId: goal2.id, status: 'active' }
      })

      // 尝试设置 goal1 的父目标为 goal3（会创建循环）
      const response = await $fetch(`/api/goals/${goal1.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json'
        },
        body: {
          parentId: goal3.id
        }
      }).catch(e => e.data)

      expect(response.success).toBe(false)
      expect(response.error).toContain('不能创建循环依赖关系')
    })

    it('应该成功移除父目标', async () => {
      const parentGoal = await testDb.goal.create({
        data: { userId, title: '父目标', status: 'active' }
      })
      const childGoal = await testDb.goal.create({
        data: { userId, title: '子目标', parentId: parentGoal.id, status: 'active' }
      })

      const response = await $fetch(`/api/goals/${childGoal.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json'
        },
        body: {
          parentId: null
        }
      })

      expect(response.success).toBe(true)
      expect(response.data.parentId).toBe(null)
    })
  })

  describe('GET /api/goals - 获取目标列表', () => {
    it('应该返回包含父目标和子目标信息的目标列表', async () => {
      const parentGoal = await testDb.goal.create({
        data: { userId, title: '父目标', status: 'active' }
      })
      const childGoal = await testDb.goal.create({
        data: { userId, title: '子目标', parentId: parentGoal.id, status: 'active' }
      })

      const response = await $fetch('/api/goals', {
        headers: {
          Authorization: authToken
        }
      })

      expect(response.success).toBe(true)
      expect(response.data).toHaveLength(2)

      const parent = response.data.find((g: any) => g.id === parentGoal.id)
      const child = response.data.find((g: any) => g.id === childGoal.id)

      expect(parent.children).toHaveLength(1)
      expect(parent.children[0].id).toBe(childGoal.id)
      expect(child.parent).not.toBeNull()
      expect(child.parent.id).toBe(parentGoal.id)
    })
  })

  describe('GET /api/goals/ancestors/:id - 获取祖先路径', () => {
    it('应该返回目标的完整祖先路径', async () => {
      // 创建层级: goal1 -> goal2 -> goal3
      const goal1 = await testDb.goal.create({
        data: { userId, title: '目标1', status: 'active' }
      })
      const goal2 = await testDb.goal.create({
        data: { userId, title: '目标2', parentId: goal1.id, status: 'active' }
      })
      const goal3 = await testDb.goal.create({
        data: { userId, title: '目标3', parentId: goal2.id, status: 'active' }
      })

      const response = await $fetch(`/api/goals/ancestors/${goal3.id}`, {
        headers: {
          Authorization: authToken
        }
      })

      expect(response.success).toBe(true)
      expect(response.data).toHaveLength(2)
      expect(response.data[0].id).toBe(goal1.id)
      expect(response.data[1].id).toBe(goal2.id)
    })

    it('应该返回空数组当目标没有祖先时', async () => {
      const goal = await testDb.goal.create({
        data: { userId, title: '根目标', status: 'active' }
      })

      const response = await $fetch(`/api/goals/ancestors/${goal.id}`, {
        headers: {
          Authorization: authToken
        }
      })

      expect(response.success).toBe(true)
      expect(response.data).toHaveLength(0)
    })

    it('应该拒绝访问其他用户的祖先路径', async () => {
      const otherUser = await testDb.user.create({
        data: {
          email: 'other@example.com',
          password: 'hashedpassword'
        }
      })

      const otherGoal = await testDb.goal.create({
        data: {
          userId: otherUser.id,
          title: '其他用户的目标'
        }
      })

      const response = await $fetch(`/api/goals/ancestors/${otherGoal.id}`, {
        headers: {
          Authorization: authToken
        }
      }).catch(e => e.data)

      expect(response.success).toBe(false)
      expect(response.error).toContain('无权访问')
    })
  })
})
