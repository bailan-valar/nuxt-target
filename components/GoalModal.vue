<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h2>{{ goal?.id ? '编辑目标' : '新增目标' }}</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-section">

          <div class="field title-field">
            <select v-model="form.status" class="status-select">
              <option value="NOT_STARTED">待开始</option>
              <option value="IN_PROGRESS">进行中</option>
              <option value="PENDING_VERIFICATION">待验证</option>
              <option value="COMPLETED">已完成</option>
              <option value="ABANDONED">已放弃</option>
            </select>
            <input v-model="form.title" required placeholder="* 标题" />
          </div>

          <div class="field">
            <label>描述</label>
            <RichTextEditor
              v-model="form.description"
              :min-height="'80px'"
            />
          </div>

          <FolderSelector
            v-model="form.folderId"
            label="所属项目"
            :allow_create="true"
          />

          <ParentGoalSelector
            v-model="form.parentGoal"
            :exclude-goal-id="goal?.id"
          />

          <PeriodSelector
            v-model:period-type="form.periodType"
            v-model:period-value="form.periodValue"
          />
        </div>

        <div class="form-section time-section">
          <div class="section-title">时间规划</div>
          <div class="time-grid">
            <div class="field">
              <label class="time-label">计划开始</label>
              <input
                v-model="form.plannedStart"
                type="datetime-local"
                step="1"
                class="time-input"
              />
            </div>
            <div class="field">
              <label class="time-label">计划结束</label>
              <input
                v-model="form.plannedEnd"
                type="datetime-local"
                step="1"
                class="time-input"
              />
            </div>
          </div>
            <div class="field">
              <label class="time-label">下次执行</label>
              <input
                v-model="form.nextExecution"
                type="datetime-local"
                step="1"
                class="time-input"
              />
            </div>
        </div>

        <div class="actions">
          <!-- 删除按钮（仅在编辑模式显示） -->
          <button
            v-if="goal?.id"
            type="button"
            class="btn-delete"
            :disabled="deleting"
            @click="showDeleteConfirm = true"
          >
            删除
          </button>

          <button type="button" class="btn-secondary" @click="$emit('close')">取消</button>
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? '保存中...' : '保存' }}
          </button>
        </div>
      </form>
    </div>

    <!-- 删除确认弹框 -->
    <div v-if="showDeleteConfirm" class="confirm-dialog-overlay" @click.self="showDeleteConfirm = false">
      <div class="confirm-dialog">
        <div class="confirm-dialog-header">
          <h3>确认删除</h3>
        </div>
        <div class="confirm-dialog-body">
          <p>确定要删除目标「{{ goal?.title }}」吗？</p>
          <p class="warning-text">此操作无法撤销</p>
        </div>
        <div class="confirm-dialog-footer">
          <button
            type="button"
            class="btn-secondary"
            @click="showDeleteConfirm = false"
          >
            取消
          </button>
          <button
            type="button"
            class="btn-danger"
            :disabled="deleting"
            @click="handleDelete"
          >
            {{ deleting ? '删除中...' : '确认删除' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type PeriodType = 'YEAR' | 'MONTH' | 'WEEK' | 'TASK' | 'CUSTOM' | ''
type GoalStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'PENDING_VERIFICATION' | 'COMPLETED' | 'ABANDONED'

interface Goal {
  id: string
  title: string
  description: string | null
  status: GoalStatus
  periodType: PeriodType | null
  periodValue: string | null
  plannedStart: string | null
  plannedEnd: string | null
  nextExecution: string | null
  parent?: Goal | null
  children?: Goal[]
}

const props = defineProps<{
  show: boolean
  goal?: Goal
  defaults?: {
    folderId: string | null
    periodType: string
    periodValue: string
    parentGoal?: Goal | null
  } | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
  deleted: []
}>()

const form = reactive({
  folderId: null as string | null,
  title: '',
  description: '',
  status: 'NOT_STARTED' as GoalStatus,
  periodType: '' as PeriodType,
  periodValue: '',
  plannedStart: '',
  plannedEnd: '',
  nextExecution: '',
  parentGoal: null as Goal | null
})

const loading = ref(false)
const deleting = ref(false)
const showDeleteConfirm = ref(false)

// 辅助函数：将 ISO 8601 字符串转换为 datetime-local 格式
const isoToDateTimeLocal = (isoString: string | null | undefined): string => {
  if (!isoString) return ''
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

watch(() => props.goal, (g) => {
  if (g) {
    form.folderId = (g as any).folderId || null
    form.title = g.title
    form.description = g.description || ''
    form.status = g.status || 'NOT_STARTED'
    form.periodType = g.periodType || ''
    form.periodValue = g.periodValue || ''
    form.plannedStart = isoToDateTimeLocal(g.plannedStart)
    form.plannedEnd = isoToDateTimeLocal(g.plannedEnd)
    form.nextExecution = isoToDateTimeLocal(g.nextExecution)
    form.parentGoal = g.parent || null
  } else {
    form.folderId = null
    form.title = ''
    form.description = ''
    form.status = 'NOT_STARTED'
    form.periodType = ''
    form.periodValue = ''
    form.plannedStart = ''
    form.plannedEnd = ''
    form.nextExecution = ''
    form.parentGoal = null
  }
}, { immediate: true })

// 当模态框打开且有默认值时应用默认值
watch(() => props.show, (isShow) => {
  if (isShow && props.defaults && !props.goal) {
    form.folderId = props.defaults.folderId
    form.periodType = props.defaults.periodType as PeriodType
    form.periodValue = props.defaults.periodValue
    // 如果提供了父目标默认值，则设置父目标
    if (props.defaults.parentGoal !== undefined) {
      form.parentGoal = props.defaults.parentGoal
    }
  }
  // 重置删除确认状态
  if (!isShow) {
    showDeleteConfirm.value = false
  }
})

const handleSubmit = async () => {
  loading.value = true
  try {
    const url = props.goal?.id ? `/api/goals/${props.goal.id}` : '/api/goals'
    const method = props.goal?.id ? 'PATCH' : 'POST'

    // 只发送非空字段
    const body: any = {
      folderId: form.folderId || undefined,
      title: form.title,
      description: form.description || undefined,
      status: form.status,
      parentId: form.parentGoal?.id || null
    }

    // 只有在有周期类型时才添加周期字段（排除空字符串）
    if (form.periodType && form.periodType !== '') {
      body.periodType = form.periodType
      body.periodValue = form.periodValue
    }

    // 添加时间规划字段（datetime-local 格式可以被 Date 解析）
    if (form.plannedStart) {
      body.plannedStart = new Date(form.plannedStart).toISOString()
    }
    if (form.plannedEnd) {
      body.plannedEnd = new Date(form.plannedEnd).toISOString()
    }
    if (form.nextExecution) {
      body.nextExecution = new Date(form.nextExecution).toISOString()
    }

    await $fetch(url, { method, body })
    emit('saved')
    emit('close')
  } catch (e: any) {
    const message = e.data?.error || '保存失败'
    const { error } = useToast()
    error(message)
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (!props.goal?.id) return

  deleting.value = true
  try {
    await $fetch(`/api/goals/${props.goal.id}`, { method: 'DELETE' })
    const { success } = useToast()
    success('目标已删除')
    showDeleteConfirm.value = false
    emit('deleted')
    emit('close')
  } catch (e: any) {
    const message = e.data?.error || '删除失败'
    const { error } = useToast()
    error(message)
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.125rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #f3f4f6;
  border-radius: 6px;
  font-size: 1.125rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #111827;
}

.modal-form {
  padding: 1.125rem;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.form-section {
  margin-bottom: 0.875rem;
}

.form-section:last-child {
  margin-bottom: 0;
}

.field {
  margin-bottom: 0.625rem;
}

.field:last-child {
  margin-bottom: 0;
}

.field label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  padding: 0.5rem 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.8125rem;
  transition: border-color 0.15s, box-shadow 0.15s;
  background: white;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.field textarea {
  resize: vertical;
  min-height: 50px;
}

.title-field {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.title-field .status-select {
  flex-shrink: 0;
  width: auto;
  min-width: 100px;
}

.title-field input {
  flex: 1;
}

.time-section {
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
}

.section-title {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.625rem;
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  overflow: hidden;
}

.time-grid .field {
  margin-bottom: 0;
}

.time-label {
  font-size: 0.75rem;
  margin-bottom: 0.188rem;
}

.time-input {
  font-size: 0.75rem;
  padding: 0.375rem 0.5rem;
  min-width: 0;
}

@media (max-width: 480px) {
  .time-grid {
    grid-template-columns: 1fr;
  }
}

.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 0.875rem;
  border-top: 1px solid #e5e7eb;
}

.actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-delete {
  background: #fff;
  color: #ef4444;
  border: 1px solid #fecaca;
  margin-right: auto;
}

.btn-delete:hover:not(:disabled) {
  background: #fef2f2;
  border-color: #f87171;
}

.btn-danger {
  background: #ef4444;
  color: white;
  border: 1px solid #ef4444;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
  border-color: #dc2626;
}

/* 删除确认弹框样式 */
.confirm-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 1rem;
}

.confirm-dialog {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  animation: dialogSlideIn 0.2s ease-out;
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.confirm-dialog-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.confirm-dialog-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.confirm-dialog-body {
  padding: 1.25rem;
}

.confirm-dialog-body p {
  margin: 0;
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
}

.warning-text {
  margin-top: 0.5rem !important;
  color: #ef4444 !important;
  font-size: 0.8125rem !important;
}

.confirm-dialog-footer {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding: 0.75rem 1.25rem;
  border-top: 1px solid #e5e7eb;
}

.confirm-dialog-footer button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
</style>
