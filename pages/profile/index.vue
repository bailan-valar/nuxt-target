<template>
  <div class="profile-page">
    <!-- 返回按钮 -->
    <div class="back-button">
      <button
        @click="navigateTo('/settings')"
        class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        返回设置
      </button>
    </div>

    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">个人资料</h1>
      <p class="page-description">查看您的账户信息和统计数据</p>
    </div>

    <!-- 个人资料卡片 -->
    <div class="profile-card">
      <div class="profile-header">
        <!-- 头像 -->
        <div class="avatar">
          <div class="avatar-circle">
            {{ userInitial }}
          </div>
        </div>

        <!-- 基本信息 -->
        <div class="profile-info">
          <h2 class="profile-name">{{ user?.name || '未设置姓名' }}</h2>
          <p class="profile-email">{{ user?.email }}</p>
          <p class="profile-joined">加入于 {{ joinDate }}</p>
        </div>

        <!-- 编辑按钮 -->
        <div class="profile-actions">
          <button
            @click="navigateTo('/settings')"
            class="btn-edit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            编辑资料
          </button>
        </div>
      </div>

      <!-- 统计数据 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon goals-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">总目标数</p>
            <p class="stat-value">{{ stats.totalGoals }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon active-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">进行中</p>
            <p class="stat-value">{{ stats.activeGoals }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon completed-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">已完成</p>
            <p class="stat-value">{{ stats.completedGoals }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon folders-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z"/>
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">文件夹</p>
            <p class="stat-value">{{ stats.totalFolders }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 账户详情 -->
    <div class="details-card">
      <h3 class="details-title">账户详情</h3>
      <div class="details-list">
        <div class="detail-item">
          <span class="detail-label">用户 ID</span>
          <span class="detail-value">{{ user?.id }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">邮箱地址</span>
          <span class="detail-value">{{ user?.email }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">注册时间</span>
          <span class="detail-value">{{ fullJoinDate }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">最后更新</span>
          <span class="detail-value">{{ lastUpdated }}</span>
        </div>
      </div>
    </div>

    <!-- Toast 容器 -->
    <ClientOnly>
      <ToastContainer />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { user } = useAuth()

// 用户统计数据
const stats = ref({
  totalGoals: 0,
  activeGoals: 0,
  completedGoals: 0,
  totalFolders: 0
})

// 用户名首字母
const userInitial = computed(() => {
  if (!user.value?.name) {
    return user.value?.email?.charAt(0).toUpperCase() || 'U'
  }
  return user.value.name.charAt(0).toUpperCase()
})

// 加入日期（简短格式）
const joinDate = computed(() => {
  if (!user.value?.createdAt) return '-'
  const date = new Date(user.value.createdAt)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
})

// 完整加入日期
const fullJoinDate = computed(() => {
  if (!user.value?.createdAt) return '-'
  return new Date(user.value.createdAt).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// 最后更新时间
const lastUpdated = computed(() => {
  if (!user.value?.updatedAt) return '-'
  return new Date(user.value.updatedAt).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// 加载用户统计数据
const loadStats = async () => {
  try {
    const [goalsData, foldersData] = await Promise.all([
      $fetch('/api/goals'),
      $fetch('/api/folders')
    ])

    const goals = goalsData?.data || []
    const folders = foldersData?.data || []

    stats.value = {
      totalGoals: goals.length,
      activeGoals: goals.filter((g: any) => g.status === 'active').length,
      completedGoals: goals.filter((g: any) => g.status === 'completed').length,
      totalFolders: folders.length
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 页面加载时获取统计数据
onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.profile-page {
  @apply max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8;
}

.back-button {
  @apply mb-6;
}

.page-header {
  @apply mb-8;
}

.page-title {
  @apply text-2xl font-bold text-gray-900;
}

.page-description {
  @apply text-sm text-gray-600 mt-1;
}

.profile-card {
  @apply bg-white rounded-lg shadow border border-gray-200 overflow-hidden mb-6;
}

.profile-header {
  @apply p-6 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-6;
}

.avatar {
  @apply flex-shrink-0;
}

.avatar-circle {
  @apply w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold;
}

.profile-info {
  @apply flex-1 min-w-0;
}

.profile-name {
  @apply text-xl font-semibold text-gray-900;
}

.profile-email {
  @apply text-sm text-gray-600 mt-1;
}

.profile-joined {
  @apply text-xs text-gray-500 mt-2;
}

.profile-actions {
  @apply flex-shrink-0;
}

.btn-edit {
  @apply inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors;
}

.stats-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6;
}

.stat-card {
  @apply flex items-center gap-4 p-4 bg-gray-50 rounded-lg;
}

.stat-icon {
  @apply flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center;
}

.goals-icon {
  @apply bg-blue-100 text-blue-600;
}

.active-icon {
  @apply bg-green-100 text-green-600;
}

.completed-icon {
  @apply bg-purple-100 text-purple-600;
}

.folders-icon {
  @apply bg-orange-100 text-orange-600;
}

.stat-content {
  @apply flex-1 min-w-0;
}

.stat-label {
  @apply text-xs text-gray-600;
}

.stat-value {
  @apply text-2xl font-semibold text-gray-900 mt-1;
}

.details-card {
  @apply bg-white rounded-lg shadow border border-gray-200 overflow-hidden;
}

.details-title {
  @apply px-6 py-4 text-lg font-semibold text-gray-900 border-b border-gray-200;
}

.details-list {
  @apply divide-y divide-gray-200;
}

.detail-item {
  @apply px-6 py-4 flex items-center justify-between;
}

.detail-label {
  @apply text-sm font-medium text-gray-600;
}

.detail-value {
  @apply text-sm text-gray-900 font-mono;
}

@media (max-width: 640px) {
  .detail-item {
    @apply flex-col items-start gap-2;
  }
}
</style>
