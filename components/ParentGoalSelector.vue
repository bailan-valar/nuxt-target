<template>
  <div class="field">
    <label>父目标</label>
    <div class="parent-selector">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索目标..."
          class="search-input"
        />
        <button
          v-if="selectedParent"
          @click="clearSelection"
          class="clear-button"
          type="button"
          title="清除选择"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="isLoading" class="loading-state">
        <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span class="ml-2">加载中...</span>
      </div>

      <div v-else-if="error" class="error-state">
        {{ error }}
      </div>

      <div v-else-if="filteredGoals.length === 0" class="empty-state">
        {{ searchQuery ? '没有匹配的目标' : '暂无可用目标' }}
      </div>

      <div v-else class="goals-list">
        <div
          v-for="goal in filteredGoals"
          :key="goal.id"
          @click="selectGoal(goal)"
          :class="[
            'goal-item',
            { 'is-selected': selectedParent?.id === goal.id }
          ]"
          :style="{ paddingLeft: `${(goal.depth || 0) * 16 + 12}px` }"
        >
          <div class="goal-content">
            <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <div class="goal-info">
              <div class="goal-title">{{ goal.title }}</div>
              <div v-if="goal.parent" class="goal-parent">
                {{ goal.parent.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
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

const searchQuery = ref('')
const isLoading = ref(false)
const error = ref('')

// 获取目标列表
const { data: goalsData, pending, refresh } = await useFetch('/api/goals')

const goals = computed(() => {
  if (!goalsData.value?.data) return []
  return goalsData.value.data
})

// 过滤和计算深度的目标列表
const filteredGoals = computed(() => {
  let filtered = goals.value

  // 排除当前编辑的目标
  if (props.excludeGoalId) {
    filtered = filtered.filter(g => g.id !== props.excludeGoalId)
  }

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(g =>
      g.title.toLowerCase().includes(query)
    )
  }

  // 计算深度并排序
  const goalsWithDepth = filtered.map(goal => ({
    ...goal,
    depth: calculateDepth(goal)
  }))

  return goalsWithDepth
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

// 清理缓存（当目标列表变化时）
watch(goals, () => {
  depthCache.clear()
})

// 选中的父目标
const selectedParent = computed(() => props.modelValue)

// 选择目标
const selectGoal = (goal: Goal) => {
  emit('update:modelValue', goal)
}

// 清除选择
const clearSelection = () => {
  emit('update:modelValue', null)
}

// 监听加载状态
watchEffect(() => {
  isLoading.value = pending.value
  error.value = ''
})
</script>

<style scoped>
.parent-selector {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.search-box {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  background: white;
}

.search-input {
  flex: 1;
  padding: 0.5rem;
  border: none;
  outline: none;
  font-size: 0.875rem;
}

.clear-button {
  padding: 0.5rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-button:hover {
  color: #374151;
  background: #f3f4f6;
}

.loading-state,
.error-state,
.empty-state {
  padding: 1rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}

.error-state {
  color: #dc2626;
}

.goals-list {
  max-height: 200px;
  overflow-y: auto;
}

.goal-item {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.15s;
}

.goal-item:last-child {
  border-bottom: none;
}

.goal-item:hover {
  background: #f9fafb;
}

.goal-item.is-selected {
  background: #eff6ff;
}

.goal-content {
  display: flex;
  align-items: flex-start;
}

.goal-info {
  flex: 1;
  min-width: 0;
}

.goal-title {
  font-size: 0.875rem;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.goal-parent {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.125rem;
}
</style>
