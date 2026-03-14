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

        <ParentGoalSelector
          v-model="form.parentGoal"
          :exclude-goal-id="goal?.id"
        />
        <div class="field">
          <label>年目标</label>
          <textarea v-model="form.description" rows="3"></textarea>
        </div>

        <PeriodSelector
          v-model:period-type="form.periodType"
          v-model:period-value="form.periodValue"
        />

        <div class="actions">
          <button type="button" @click="$emit('close')">取消</button>
          <button type="submit" :disabled="loading">{{ loading ? '保存中...' : '保存' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
type PeriodType = 'YEAR' | 'MONTH' | 'WEEK' | ''

interface Goal {
  id: string
  group: string | null
  title: string
  description: string | null
  status: string
  periodType: PeriodType | null
  periodValue: string | null
  parent?: Goal | null
  children?: Goal[]
}

const props = defineProps<{
  show: boolean
  goal?: Goal
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const form = reactive({
  group: '',
  title: '',
  description: '',
  periodType: '' as PeriodType,
  periodValue: '',
  parentGoal: null as Goal | null
})

const loading = ref(false)

watch(() => props.goal, (g) => {
  if (g) {
    form.group = g.group || ''
    form.title = g.title
    form.description = g.description || ''
    form.periodType = g.periodType || ''
    form.periodValue = g.periodValue || ''
    form.parentGoal = g.parent || null
  } else {
    form.group = ''
    form.title = ''
    form.description = ''
    form.periodType = ''
    form.periodValue = ''
    form.parentGoal = null
  }
}, { immediate: true })

const handleSubmit = async () => {
  loading.value = true
  try {
    const url = props.goal?.id ? `/api/goals/${props.goal.id}` : '/api/goals'
    const method = props.goal?.id ? 'PATCH' : 'POST'

    // 只发送非空字段
    const body: any = {
      group: form.group || undefined,
      title: form.title,
      description: form.description || undefined,
      parentId: form.parentGoal?.id || null
    }

    // 只有在有周期类型时才添加周期字段
    if (form.periodType) {
      body.periodType = form.periodType
      body.periodValue = form.periodValue
    }

    await $fetch(url, { method, body })
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
