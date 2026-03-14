<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">我的目标</h1>
        <p class="text-sm text-gray-600 mt-1">管理和追踪您的目标进度</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- 视图切换 -->
        <div class="inline-flex rounded-lg border border-gray-300 p-1">
          <button
            @click="view = 'week'"
            :class="[
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              view === 'week' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            周
          </button>
          <button
            @click="view = 'month'"
            :class="[
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              view === 'month' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            月
          </button>
          <button
            @click="view = 'year'"
            :class="[
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              view === 'year' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            年
          </button>
        </div>

        <!-- 新增按钮 -->
        <button
          @click="showModal = true"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          新增目标
        </button>
      </div>
    </div>

    <GoalModal :show="showModal" @close="showModal = false" @saved="handleSaved" />

    <!-- 加载状态 -->
    <div v-if="pending" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">加载中...</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <p class="text-red-800">{{ error.message }}</p>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="goals?.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">暂无目标</h3>
      <p class="mt-1 text-sm text-gray-500">点击"新增目标"按钮创建您的第一个目标</p>
    </div>

    <!-- 年视图 -->
    <div v-else-if="view === 'year'" class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">项目组</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">项目</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center gap-1">
                  <span>年目标</span>
                  <button
                    @click="showModal = true"
                    class="inline-flex items-center justify-center w-5 h-5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="新增年目标"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </th>
              <th v-for="m in 12" :key="m" class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center justify-center gap-1">
                  <span>{{ m }}月</span>
                  <button
                    @click="handleAddMonthGoal('', m)"
                    class="inline-flex items-center justify-center w-5 h-5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    :title="`为${m}月添加目标`"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="goal in goals" :key="goal.id" class="hover:bg-gray-50">
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ goal.group || '-' }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex items-center gap-2">
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <span>{{ goal.title }}</span>
                      <span v-if="goal.parent" class="text-xs text-gray-500">
                        ({{ goal.parent.title }})
                      </span>
                    </div>
                    <div v-if="goal.children && goal.children.length > 0" class="text-xs text-gray-500 mt-1">
                      {{ goal.children.length }} 个子目标
                    </div>
                  </div>
                  <button
                    @click="showModal = true"
                    class="inline-flex items-center justify-center w-6 h-6 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors flex-shrink-0"
                    title="添加项目"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </td>
              <td class="px-4 py-4 text-sm text-gray-600">{{ goal.description || '-' }}</td>
              <td v-for="m in 12" :key="m" class="px-2 py-2 whitespace-nowrap text-center text-sm">
                <button
                  @click="handleAddMonthGoal(goal.id, m)"
                  class="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="为{{ m }}月添加目标"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 周/月视图 -->
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="goal in goals"
        :key="goal.id"
        class="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">{{ goal.title }}</h3>
            <div v-if="goal.parent" class="mt-1 flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span>{{ goal.parent.title }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span
              v-if="getPeriodDisplay(goal)"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
            >
              {{ getPeriodDisplay(goal) }}
            </span>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="{
                'bg-blue-100 text-blue-800': goal.status === 'active',
                'bg-green-100 text-green-800': goal.status === 'completed',
                'bg-gray-100 text-gray-800': goal.status === 'archived'
              }"
            >
              {{ statusText(goal.status) }}
            </span>
          </div>
        </div>

        <p v-if="goal.description" class="text-gray-600 text-sm mb-4 line-clamp-2">
          {{ goal.description }}
        </p>

        <!-- 显示子目标数量 -->
        <div v-if="goal.children && goal.children.length > 0" class="mb-4 flex items-center text-sm text-gray-600">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span>{{ goal.children.length }} 个子目标</span>
        </div>

        <div class="flex items-center justify-between text-sm text-gray-500">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formatDate(goal.createdAt) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPeriodLabel } from '~/lib/validations/period-utils'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { signOut } = useAuth()
const view = ref<'year' | 'month' | 'week'>('month')
const showModal = ref(false)

const { data, pending, error, refresh } = await useFetch('/api/goals')
const goals = computed(() => data.value?.data || [])

const handleSaved = () => {
  refresh()
}

const statusText = (status: string) => {
  const map: Record<string, string> = {
    active: '进行中',
    completed: '已完成',
    archived: '已归档'
  }
  return map[status] || status
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const getPeriodDisplay = (goal: any) => {
  if (!goal.period_type || !goal.period_value) return null
  return getPeriodLabel(goal.period_type, goal.period_value)
}

const handleAddMonthGoal = (goalId: string, month: number) => {
  // 打开模态框并传递目标ID和月份信息
  showModal.value = true
  // TODO: 可以将goalId和month传递给GoalModal组件作为默认值
}

const handleSignOut = async () => {
  await signOut()
  await navigateTo('/')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
