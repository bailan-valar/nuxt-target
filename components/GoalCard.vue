<template>
  <div class="goal-card">
    <div class="goal-header">
      <h3>{{ goal.title }}</h3>
      <span class="status" :class="goal.status">{{ statusText }}</span>
    </div>
    <p v-if="goal.description">{{ goal.description }}</p>
    <div class="actions">
      <button @click="$emit('edit', goal.id)">Edit</button>
      <button @click="$emit('delete', goal.id)" class="delete">Delete</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/types'

const props = defineProps<{
  goal: Goal
}>()

defineEmits<{
  edit: [id: string]
  delete: [id: string]
}>()

const statusTextMap: Record<string, string> = {
  NOT_STARTED: '待开始',
  IN_PROGRESS: '进行中',
  PENDING_VERIFICATION: '待验证',
  COMPLETED: '已完成',
  ABANDONED: '已放弃'
}

const statusText = computed(() => statusTextMap[props.goal.status] || props.goal.status)
</script>

<style scoped>
.goal-card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}
.status.NOT_STARTED { background: #e3f2fd; color: #1976d2; }
.status.IN_PROGRESS { background: #fff3e0; color: #f57c00; }
.status.PENDING_VERIFICATION { background: #f3e5f5; color: #7b1fa2; }
.status.COMPLETED { background: #e8f5e9; color: #388e3c; }
.status.ABANDONED { background: #ffebee; color: #c62828; }
.actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}
button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:first-child {
  background: #0070f3;
  color: white;
}
button.delete {
  background: #dc3545;
  color: white;
}
</style>
