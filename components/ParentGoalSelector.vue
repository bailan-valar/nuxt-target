<template>
  <div class="field">
    <label for="parent-goal-select">父目标</label>
    <select
      id="parent-goal-select"
      v-model="selectedValue"
      class="parent-goal-select"
      :disabled="isLoading"
    >
      <option value="">
        {{ isLoading ? '加载中...' : '无父目标' }}
      </option>
      <option
        v-for="goal in filteredGoals"
        :key="goal.id"
        :value="goal.id"
      >
        {{ goal.indentedTitle }}
      </option>
    </select>
    <div v-if="error" class="error-state">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Goal {
  id: string
  title: string
  status: string
  parent?: { id: string; title: string } | null
  depth?: number
}

const props = defineProps<{
  modelValue?: Goal | null
  excludeGoalId?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Goal | null]
}>()

const isLoading = ref(false)
const error = ref('')

// 获取目标列表
const { data: goalsData, pending, refresh } = await useFetch('/api/goals')

const goals = computed(() => {
  if (!goalsData.value?.data) return []
  return goalsData.value.data
})

// 深度计算缓存
const depthCache = new Map<string, number>()

// 计算目标深度（用于显示层级缩进）
const calculateDepth = (goal: Goal): number => {
  // 检查缓存
  if (depthCache.has(goal.id)) {
    return depthCache.get(goal.id)!
  }

  let depth = 0
  let current = goal
  const visited = new Set<string>()

  while (current.parent) {
    // 防止循环
    if (visited.has(current.id)) {
      break
    }
    visited.add(current.id)

    depth++

    // 检查父级缓存
    if (depthCache.has(current.parent.id)) {
      depth += depthCache.get(current.parent.id)!
      break
    }

    // 找到父目标的完整信息
    const parent = goals.value.find(g => g.id === current.parent?.id)
    if (!parent) break
    current = parent as Goal
  }

  // 缓存结果
  depthCache.set(goal.id, depth)
  return depth
}

// 过滤和计算深度的目标列表
const filteredGoals = computed(() => {
  let filtered = goals.value

  // 排除当前编辑的目标
  if (props.excludeGoalId) {
    filtered = filtered.filter(g => g.id !== props.excludeGoalId)
  }

  // 计算深度并添加缩进标题
  const goalsWithDepth = filtered.map(goal => {
    const depth = calculateDepth(goal)
    const indent = '　'.repeat(depth) // 使用全角空格缩进
    return {
      ...goal,
      depth,
      indentedTitle: `${indent}${goal.title}`
    }
  })

  // 按深度和标题排序
  return goalsWithDepth.sort((a: Goal & { indentedTitle: string; depth: number }, b: Goal & { indentedTitle: string; depth: number }) => {
    if (a.depth !== b.depth) {
      return a.depth - b.depth
    }
    return a.title.localeCompare(b.title, 'zh-CN')
  })
})

// 清理缓存（当目标列表变化时）
watch(goals, () => {
  depthCache.clear()
})

// 内部选中的值（goal.id）
const selectedValue = computed({
  get: () => props.modelValue?.id || '',
  set: (value: string) => {
    if (value) {
      const goal = filteredGoals.value.find((g: Goal & { indentedTitle: string; depth: number }) => g.id === value)
      if (goal) {
        emit('update:modelValue', goal)
      }
    } else {
      emit('update:modelValue', null)
    }
  }
})

// 监听加载状态
watchEffect(() => {
  isLoading.value = pending.value
  error.value = ''
})
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.parent-goal-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.875rem;
  color: #111827;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  cursor: pointer;
}

.parent-goal-select:hover {
  border-color: #9ca3af;
}

.parent-goal-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.parent-goal-select:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.error-state {
  margin-top: 0.25rem;
  padding: 0.5rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  color: #dc2626;
  font-size: 0.875rem;
}
</style>
