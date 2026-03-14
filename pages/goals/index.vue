<template>
  <div class="container">
    <div class="header">
      <h1>我的目标</h1>
      <div class="view-toggle">
        <button @click="view = 'year'" :class="{ active: view === 'year' }">年</button>
        <button @click="view = 'month'" :class="{ active: view === 'month' }">月</button>
        <button @click="view = 'week'" :class="{ active: view === 'week' }">周</button>
      </div>
      <button @click="showModal = true" class="btn-add">新增目标</button>
      <button @click="handleSignOut" class="btn-signout">退出</button>
    </div>

    <GoalModal :show="showModal" @close="showModal = false" @saved="handleSaved" />

    <div v-if="pending" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error.message }}</div>

    <div v-else-if="goals?.length === 0" class="empty">
      <p>暂无目标</p>
    </div>

    <div v-else-if="view === 'year'" class="year-view">
      <table class="year-table">
        <thead>
          <tr>
            <th>项目组</th>
            <th>项目</th>
            <th>年目标</th>
            <th v-for="m in 12" :key="m">{{ m }}月</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="goal in goals" :key="goal.id">
            <td>{{ goal.group || '-' }}</td>
            <td>{{ goal.title }}</td>
            <td>{{ goal.description || '-' }}</td>
            <td v-for="m in 12" :key="m"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="goals-list">
      <div v-for="goal in goals" :key="goal.id" class="goal-card">
        <h3>{{ goal.title }}</h3>
        <p v-if="goal.description">{{ goal.description }}</p>
        <div class="meta">
          <span class="status" :class="goal.status">{{ statusText(goal.status) }}</span>
          <span class="date">{{ formatDate(goal.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
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

const handleSignOut = async () => {
  await signOut()
  await navigateTo('/')
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
}

.view-toggle button {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.view-toggle button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

h1 {
  margin: 0;
}

.btn-add {
  padding: 0.5rem 1rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-signout {
  padding: 0.5rem 1rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.loading, .error, .empty {
  text-align: center;
  padding: 2rem;
}

.error {
  color: #dc3545;
  background: #fee;
  border-radius: 4px;
}

.goals-list {
  display: grid;
  gap: 1rem;
}

.goal-card {
  padding: 1.5rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.goal-card h3 {
  margin: 0 0 0.5rem 0;
}

.goal-card p {
  margin: 0 0 1rem 0;
  color: #666;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 500;
}

.status.active {
  background: #d1ecf1;
  color: #0c5460;
}

.status.completed {
  background: #d4edda;
  color: #155724;
}

.status.archived {
  background: #f8d7da;
  color: #721c24;
}

.date {
  color: #999;
}

.year-view {
  overflow-x: auto;
}

.year-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  font-size: 0.875rem;
}

.year-table th,
.year-table td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}

.year-table th {
  background: #f8f9fa;
  font-weight: 600;
  white-space: nowrap;
}

.year-table td {
  min-width: 80px;
}

.year-table td:first-child,
.year-table td:nth-child(2),
.year-table td:nth-child(3) {
  min-width: 120px;
}
</style>
