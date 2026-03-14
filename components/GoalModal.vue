<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2>{{ goal?.id ? '编辑目标' : '新增目标' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label>项目组</label>
          <input v-model="form.group" type="text" />
        </div>
        <div class="field">
          <label>项目 *</label>
          <input v-model="form.title" required />
        </div>
        <div class="field">
          <label>年目标</label>
          <textarea v-model="form.description" rows="3"></textarea>
        </div>
        <div class="actions">
          <button type="button" @click="$emit('close')">取消</button>
          <button type="submit" :disabled="loading">{{ loading ? '保存中...' : '保存' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
  goal?: any
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const form = reactive({
  group: '',
  title: '',
  description: ''
})

const loading = ref(false)

watch(() => props.goal, (g) => {
  if (g) {
    form.group = g.group || ''
    form.title = g.title
    form.description = g.description || ''
  } else {
    form.group = ''
    form.title = ''
    form.description = ''
  }
}, { immediate: true })

const handleSubmit = async () => {
  loading.value = true
  try {
    const url = props.goal?.id ? `/api/goals/${props.goal.id}` : '/api/goals'
    const method = props.goal?.id ? 'PUT' : 'POST'

    await $fetch(url, { method, body: form })
    emit('saved')
    emit('close')
  } catch (e: any) {
    alert(e.data?.error || '保存失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.modal h2 {
  margin: 0 0 1.5rem 0;
}

.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.field input,
.field textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.actions button[type="button"] {
  background: #6c757d;
  color: white;
}

.actions button[type="submit"] {
  background: #007bff;
  color: white;
}

.actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
