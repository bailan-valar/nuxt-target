import type { Goal, CreateGoalInput, UpdateGoalInput } from '~/types'

export function useGoals() {
  const goals = ref<Goal[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchGoals = async () => {
    loading.value = true
    error.value = null
    try {
      goals.value = await $fetch('/api/goals')
    } catch (e) {
      error.value = `Failed to fetch goals: ${e instanceof Error ? e.message : 'Unknown error'}`
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const createGoal = async (input: CreateGoalInput) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/goals', {
        method: 'POST',
        body: input
      })
      goals.value = [data, ...goals.value]
      return data
    } catch (e) {
      error.value = `Failed to create goal: ${e instanceof Error ? e.message : 'Unknown error'}`
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const updateGoal = async (id: string, updates: UpdateGoalInput) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch(`/api/goals/${id}`, {
        method: 'PATCH',
        body: updates
      })
      goals.value = goals.value.map(g => g.id === id ? { ...g, ...data } : g)
      return data
    } catch (e) {
      error.value = `Failed to update goal: ${e instanceof Error ? e.message : 'Unknown error'}`
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const deleteGoal = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`/api/goals/${id}`, { method: 'DELETE' })
      goals.value = goals.value.filter(g => g.id !== id)
    } catch (e) {
      error.value = `Failed to delete goal: ${e instanceof Error ? e.message : 'Unknown error'}`
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    goals,
    loading,
    error,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal
  }
}
