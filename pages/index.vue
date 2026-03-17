<template>
  <div class="space-y-6">
    <!-- 欢迎区域 -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-2">欢迎回来!</h1>
          <p class="text-blue-100">这是您的仪表板，可以快速查看和管理您的工作</p>
        </div>
        <div class="mt-4 md:mt-0">
          <p class="text-sm text-blue-100">{{ currentDate }}</p>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- 目标总数 -->
      <div class="bg-white rounded-lg shadow border border-gray-200 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">目标总数</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.totalGoals }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">本月新增 {{ stats.newGoalsThisMonth }} 个</p>
      </div>

      <!-- 进行中 -->
      <div class="bg-white rounded-lg shadow border border-gray-200 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">进行中</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.activeGoals }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">完成率 {{ stats.completionRate }}%</p>
      </div>

      <!-- 已完成 -->
      <div class="bg-white rounded-lg shadow border border-gray-200 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">已完成</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.completedGoals }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">今年累计 {{ stats.completedThisYear }} 个</p>
      </div>

      <!-- 待处理任务 -->
      <div class="bg-white rounded-lg shadow border border-gray-200 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">待处理</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.pendingTasks }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">{{ stats.urgentTasks }} 个紧急</p>
      </div>
    </div>

    <!-- 快速操作和最近活动 -->
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- 快速操作 -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow border border-gray-200 p-5">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
          <div class="space-y-2">
            <NuxtLink
              to="/goals"
              class="flex items-center px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-blue-300 transition-all group"
            >
              <div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">新增目标</p>
                <p class="text-xs text-gray-500">创建新的目标</p>
              </div>
            </NuxtLink>

            <NuxtLink
              to="/tasks"
              class="flex items-center px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-green-300 transition-all group"
            >
              <div class="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">查看任务</p>
                <p class="text-xs text-gray-500">管理您的任务</p>
              </div>
            </NuxtLink>

            <NuxtLink
              to="/analytics"
              class="flex items-center px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-purple-300 transition-all group"
            >
              <div class="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">数据分析</p>
                <p class="text-xs text-gray-500">查看统计报表</p>
              </div>
            </NuxtLink>

            <NuxtLink
              to="/settings"
              class="flex items-center px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all group"
            >
              <div class="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">系统设置</p>
                <p class="text-xs text-gray-500">配置系统参数</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 最近活动 -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">最近目标</h2>
            <NuxtLink
              to="/goals"
              class="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              查看全部 →
            </NuxtLink>
          </div>

          <!-- 加载状态 -->
          <div v-if="pending" class="flex items-center justify-center py-8">
            <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>

          <!-- 空状态 -->
          <div v-else-if="!recentGoals || recentGoals.length === 0" class="text-center py-8">
            <svg class="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="mt-2 text-sm text-gray-500">暂无目标</p>
            <p class="text-xs text-gray-400">点击"新增目标"开始使用</p>
          </div>

          <!-- 目标列表 -->
          <div v-else class="space-y-3">
            <div
              v-for="goal in recentGoals"
              :key="goal.id"
              class="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              @click="openEditGoal(goal)"
            >
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <h3 class="text-sm font-medium text-gray-900 truncate">{{ goal.title }}</h3>
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    :class="{
                      'bg-blue-100 text-blue-800': goal.status === 'NOT_STARTED',
                      'bg-orange-100 text-orange-800': goal.status === 'IN_PROGRESS',
                      'bg-purple-100 text-purple-800': goal.status === 'PENDING_VERIFICATION',
                      'bg-green-100 text-green-800': goal.status === 'COMPLETED',
                      'bg-red-100 text-red-800': goal.status === 'ABANDONED'
                    }"
                  >
                    {{ statusText(goal.status) }}
                  </span>
                </div>
                <p v-if="goal.description" class="text-xs text-gray-500 mt-0.5 truncate">
                  {{ goal.description }}
                </p>
              </div>
              <div class="ml-3 flex items-center space-x-2">
                <span class="text-xs text-gray-400">{{ formatDate(goal.createdAt) }}</span>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 目标弹框 -->
    <GoalModal
      v-if="showGoalModal"
      :goal="editingGoal"
      @close="showGoalModal = false; editingGoal = null"
      @saved="handleGoalSaved"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

// 目标弹框
const showGoalModal = ref(false)
const editingGoal = ref<any>(null)

const openEditGoal = (goal: any) => {
  editingGoal.value = goal
  showGoalModal.value = true
}

const handleGoalSaved = () => {
  showGoalModal.value = false
  editingGoal.value = null
  // 刷新数据
  refresh()
}

// 当前日期
const currentDate = computed(() => {
  const now = new Date()
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }
  return now.toLocaleDateString('zh-CN', options)
})

// 获取目标数据
const { data, pending, refresh } = await useFetch('/api/goals')
const goals = computed(() => data.value?.data || [])

// 统计数据
const stats = computed(() => {
  const allGoals = goals.value
  const now = new Date()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisYear = new Date(now.getFullYear(), 0, 1)

  const activeGoals = allGoals.filter((g: any) => g.status === 'IN_PROGRESS')
  const completedGoals = allGoals.filter((g: any) => g.status === 'COMPLETED')
  const newGoalsThisMonth = allGoals.filter((g: any) => {
    const createdAt = new Date(g.createdAt)
    return createdAt >= thisMonth
  })
  const completedThisYear = allGoals.filter((g: any) => {
    const createdAt = new Date(g.createdAt)
    return g.status === 'COMPLETED' && createdAt >= thisYear
  })

  const totalGoals = allGoals.length
  const completionRate = totalGoals > 0
    ? Math.round((completedGoals.length / totalGoals) * 100)
    : 0

  return {
    totalGoals,
    activeGoals: activeGoals.length,
    completedGoals: completedGoals.length,
    newGoalsThisMonth: newGoalsThisMonth.length,
    completedThisYear: completedThisYear.length,
    completionRate,
    pendingTasks: 0, // TODO: 从任务 API 获取
    urgentTasks: 0   // TODO: 从任务 API 获取
  }
})

// 最近目标（最多显示 5 个）
const recentGoals = computed(() => {
  return goals.value
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

const statusText = (status: string) => {
  const map: Record<string, string> = {
    NOT_STARTED: '待开始',
    IN_PROGRESS: '进行中',
    PENDING_VERIFICATION: '待验证',
    COMPLETED: '已完成',
    ABANDONED: '已放弃'
  }
  return map[status] || status
}

const formatDate = (date: string) => {
  const d = new Date(date)
  const now = new Date()
  const diffTime = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays} 天前`

  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}
</script>
