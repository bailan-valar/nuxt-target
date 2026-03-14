<template>
  <div class="goal-card">
    <div class="goal-header">
      <h3>{{ goal.title }}</h3>
      <span class="status" :class="goal.status">{{ goal.status }}</span>
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

defineProps<{
  goal: Goal
}>()

defineEmits<{
  edit: [id: string]
  delete: [id: string]
}>()
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
.status.active { background: #e3f2fd; color: #1976d2; }
.status.completed { background: #e8f5e9; color: #388e3c; }
.status.archived { background: #f5f5f5; color: #757575; }
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
