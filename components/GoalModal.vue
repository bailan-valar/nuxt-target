<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <div class="header-left">
          <button class="close-btn" @click="$emit('close')">←</button>
          <span class="header-title">{{ goal?.id ? '编辑目标' : '新增目标' }}</span>
        </div>
        <div class="header-actions">
          <button
            v-if="goal?.id"
            type="button"
            class="btn-icon btn-delete"
            :disabled="deleting"
            @click="showDeleteConfirm = true"
            title="删除"
          >
            🗑️
          </button>
          <button type="submit" class="btn-save" form="goal-form" :disabled="loading">
            {{ loading ? '保存中...' : '完成' }}
          </button>
        </div>
      </div>

      <form id="goal-form" @submit.prevent="handleSubmit" class="modal-content">
        <!-- 左列：编辑器区域 -->
        <div class="editor-column">
          <div class="cover-area"></div>

          <div class="editor-content">
            <!-- 图标选择器 -->
            <div class="icon-picker">
              <button type="button" class="icon-btn" @click="showEmojiPicker = !showEmojiPicker">
                <span v-if="form.icon" class="icon">{{ form.icon }}</span>
                <span v-else class="icon-placeholder">📄</span>
              </button>
              <!-- 简单的 emoji 选择器 -->
              <div v-if="showEmojiPicker" class="emoji-picker">
                <button v-for="emoji in commonEmojis" :key="emoji" type="button" class="emoji-option" @click="form.icon = emoji; showEmojiPicker = false">
                  {{ emoji }}
                </button>
              </div>
            </div>

            <!-- 标题编辑器 -->
            <input
              v-model="form.title"
              class="title-input"
              placeholder="无标题"
              required
            />

            <!-- 内容编辑器 -->
            <div class="content-editor">
              <RichTextEditor
                v-model="form.description"
                :min-height="'120px'"
                :placeholder="'添加描述...'"
              />
            </div>
          </div>
        </div>

        <!-- 右列：属性编辑器 -->
        <div class="properties-column">
          <div class="properties-header">
            <span class="properties-title">属性</span>
            <button type="button" class="btn-add-property" title="添加属性">+</button>
          </div>

          <div class="properties-list">
            <!-- 状态 -->
            <div class="property-item">
              <div class="property-label">
                <span class="property-icon">📊</span>
                <span>状态</span>
              </div>
              <select v-model="form.status" class="property-value">
                <option value="NOT_STARTED">待开始</option>
                <option value="IN_PROGRESS">进行中</option>
                <option value="PENDING_VERIFICATION">待验证</option>
                <option value="COMPLETED">已完成</option>
                <option value="ABANDONED">已放弃</option>
              </select>
            </div>

            <!-- 所属项目 -->
            <div class="property-item">
              <div class="property-label">
                <span class="property-icon">📁</span>
                <span>项目</span>
              </div>
              <div class="property-value">
                <FolderSelector
                  v-model="form.folderId"
                  :label="''"
                  :allow_create="true"
                />
              </div>
            </div>

            <!-- 父目标 -->
            <div class="property-item">
              <div class="property-label">
                <span class="property-icon">🎯</span>
                <span>父目标</span>
              </div>
              <div class="property-value">
                <ParentGoalSelector
                  v-model="form.parentGoal"
                  :exclude-goal-id="goal?.id"
                />
              </div>
            </div>

            <!-- 周期 -->
            <div class="property-item">
              <div class="property-label">
                <span class="property-icon">🔄</span>
                <span>周期</span>
              </div>
              <div class="property-value">
                <PeriodSelector
                  v-model:period-type="form.periodType"
                  v-model:period-value="form.periodValue"
                />
              </div>
            </div>

            <!-- 计划开始 -->
            <div class="property-item">
              <div class="property-label">
                <span class="property-icon">📅</span>
                <span>计划开始</span>
              </div>
              <input
                v-model="form.plannedStart"
                type="datetime-local"
                step="1"
                class="property-value"
              />
            </div>

            <!-- 计划结束 -->
            <div class="property-item">
              <div class="property-label">
                <span class="property-icon">🏁</span>
                <span>计划结束</span>
              </div>
              <input
                v-model="form.plannedEnd"
                type="datetime-local"
                step="1"
                class="property-value"
              />
            </div>

            <!-- 下次执行 -->
            <div class="property-item">
              <div class="property-label">
                <span class="property-icon">⏰</span>
                <span>下次执行</span>
              </div>
              <input
                v-model="form.nextExecution"
                type="datetime-local"
                step="1"
                class="property-value"
              />
            </div>
          </div>
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
type PeriodType = 'YEAR' | 'MONTH' | 'WEEK' | 'TASK' | 'CUSTOM'
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
  icon?: string | null
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
  periodType: '' as PeriodType | '',
  periodValue: '',
  plannedStart: '',
  plannedEnd: '',
  nextExecution: '',
  parentGoal: null as Goal | null,
  icon: ''
})

const loading = ref(false)
const deleting = ref(false)
const showDeleteConfirm = ref(false)
const showEmojiPicker = ref(false)

// 常用 emoji 列表
const commonEmojis = [
  '🎯', '📋', '📝', '✅', '⭐', '🔥', '💡', '🚀',
  '🎨', '🎵', '📚', '💻', '🏃', '🧘', '💪', '🎉',
  '🌟', '💎', '🔮', '🌈', '⚡', '🌊', '🔔', '📌'
]

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
    form.icon = g.icon || ''
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
    form.icon = ''
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
      parentId: form.parentGoal?.id || null,
      icon: form.icon || undefined
    }

    // 只有在有周期类型时才添加周期字段
    if (form.periodType) {
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
  margin: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 0;
  width: 100%;
  max-width: 900px;
  height: 100%;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
  height: 48px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.close-btn {
  padding: 0.375rem 0.625rem;
  border: none;
  background: transparent;
  border-radius: 4px;
  font-size: 1.125rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
}

.close-btn:hover {
  background: #f3f4f6;
}

.header-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-icon {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  border-radius: 4px;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-icon:hover {
  background: #f3f4f6;
}

.btn-delete {
  color: #e03e3e;
}

.btn-save {
  padding: 0.4375rem 0.875rem;
  border: none;
  background: #2383e2;
  color: white;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-save:hover:not(:disabled) {
  background: #1a6fb8;
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 320px;
  overflow: hidden;
}

.editor-column {
  overflow-y: auto;
  border-right: 1px solid #e5e7eb;
}

.editor-column::-webkit-scrollbar {
  width: 8px;
}

.editor-column::-webkit-scrollbar-track {
  background: transparent;
}

.editor-column::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.editor-column::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.cover-area {
  height: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: height 0.2s;
}

.editor-content {
  padding: 2.5rem 3rem;
  max-width: 900px;
}

.icon-picker {
  position: relative;
  margin-bottom: 0.5rem;
}

.icon-btn {
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: transform 0.15s;
}

.icon-btn:hover {
  transform: scale(1.1);
}

.icon {
  font-size: 4rem;
  line-height: 1;
}

.icon-placeholder {
  font-size: 4rem;
  opacity: 0.3;
}

.emoji-picker {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.25rem;
  padding: 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.emoji-option {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  border-radius: 4px;
  font-size: 1.25rem;
  cursor: pointer;
  transition: background 0.15s;
}

.emoji-option:hover {
  background: #f3f4f6;
}

.title-input {
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.title-input:focus {
  outline: none;
}

.title-input::placeholder {
  color: #9ca3af;
}

.content-editor {
  min-height: 200px;
}

.properties-column {
  overflow-y: auto;
  background: #f7f6f3;
}

.properties-column::-webkit-scrollbar {
  width: 8px;
}

.properties-column::-webkit-scrollbar-track {
  background: transparent;
}

.properties-column::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.properties-column::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.properties-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.properties-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #787774;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.btn-add-property {
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  border-radius: 4px;
  font-size: 1rem;
  color: #787774;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-add-property:hover {
  background: #e5e7eb;
  color: #374151;
}

.properties-list {
  padding: 0.75rem 0;
}

.property-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.375rem 1rem;
  transition: background 0.15s;
}

.property-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.property-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100px;
  flex-shrink: 0;
  font-size: 0.8125rem;
  color: #787774;
}

.property-icon {
  font-size: 1rem;
}

.property-value {
  flex: 1;
  padding: 0.375rem 0.625rem;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 0.8125rem;
  background: transparent;
  transition: all 0.15s;
}

.property-value:hover {
  background: white;
  border-color: #e5e7eb;
}

.property-value:focus {
  outline: none;
  background: white;
  border-color: #2383e2;
}

.property-value select {
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 0.8125rem;
  cursor: pointer;
}

.property-value select:focus {
  outline: none;
}

@media (max-width: 768px) {
  .modal {
    max-width: 100%;
  }

  .modal-content {
    grid-template-columns: 1fr;
  }

  .properties-column {
    display: none;
  }

  .editor-content {
    padding: 1.5rem;
  }

  .title-input {
    font-size: 2rem;
  }
}

/* 删除确认弹框样式 */
.confirm-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 1rem;
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.confirm-dialog {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  animation: scaleIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.confirm-dialog-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.confirm-dialog-header h3 {
  margin: 0;
  font-size: 1rem;
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
  color: #e03e3e !important;
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
  padding: 0.5625rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
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

.btn-danger {
  background: #e03e3e;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c72e2e;
}
</style>
