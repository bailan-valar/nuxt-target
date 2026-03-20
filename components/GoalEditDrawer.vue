<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="show" class="goal-drawer-overlay" @click.self="handleClose">
        <div class="goal-drawer" :class="{ 'is-open': show, 'is-fullscreen': isFullscreen }">
          <!-- 顶部工具栏 -->
          <div class="drawer-header">
            <div class="header-left">
              <button @click="handleClose" class="header-btn close-btn" type="button" title="关闭">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <div class="header-breadcrumb">
                <span v-if="folderName">{{ folderName }}</span>
                <span v-else>无项目</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <span class="breadcrumb-current">{{ goal?.id ? '编辑目标' : '新建目标' }}</span>
              </div>
            </div>
            <div class="header-right">
              <div class="save-status">
                <span v-if="saving" class="save-saving">保存中...</span>
                <span v-else-if="lastSaved" class="save-saved">已保存 {{ lastSaved }}</span>
                <span v-else class="save-unsaved">未保存</span>
              </div>
              <button @click="isFullscreen = !isFullscreen" class="header-btn" type="button"
                :title="isFullscreen ? '退出全屏' : '全屏'">
                <svg v-if="!isFullscreen" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2">
                  <path
                    d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2">
                  <path
                    d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </svg>
              </button>
              <button v-if="goal?.id" @click="showDeleteConfirm = true" class="header-btn header-btn-danger"
                type="button" title="删除">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
              <button @click="handleSave" class="header-btn header-btn-primary" type="button" :disabled="loading">
                {{ loading ? '保存中...' : '完成' }}
              </button>
            </div>
          </div>

          <!-- 主内容区 -->
          <div class="drawer-content space-between">
            <div class="flex-1 overflow-scroll flex" style="justify-content: center;">
              <div class="editor-container">
                <!-- 图标选择器 -->
                <div class="icon-picker-wrapper">
                  <button @click="showEmojiPicker = !showEmojiPicker" class="icon-btn" type="button">
                    {{ form.icon || '🎯' }}
                  </button>
                  <Transition name="fade">
                    <div v-if="showEmojiPicker" class="emoji-picker" @click.stop>
                      <div class="emoji-grid">
                        <button v-for="emoji in commonEmojis" :key="emoji" @click="selectEmoji(emoji)"
                          class="emoji-item" type="button">
                          {{ emoji }}
                        </button>
                      </div>
                    </div>
                  </Transition>
                </div>

                <!-- 标题输入 -->
                <input ref="titleInputRef" v-model="form.title" class="title-input" placeholder="无标题"
                  @input="onContentChange" @keyup.enter="focusEditor" />

                <!-- 无边框富文本编辑器 -->
                <div class="notion-editor-wrapper">
                  <NotionEditor ref="editorRef" v-model="form.description" :placeholder="'添加描述...'"
                    :min-height="'200px'" :editable="true" @update:modelValue="onContentChange" />
                </div>
            </div>
            </div>
            <!-- 右侧属性面板 -->
            <div class="properties-panel">
              <div class="properties-header">
                <span class="properties-title">属性</span>
              </div>

              <div class="properties-list">
                <!-- 状态 -->
                <div class="property-item">
                  <div class="property-label">
                    <span class="property-icon">📊</span>
                    <span>状态</span>
                  </div>
                  <select v-model="form.status" class="property-select" @change="onContentChange">
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
                    <FolderSelector v-model="form.folderId" :label="''" :allow_create="true"
                      @update:modelValue="onContentChange" />
                  </div>
                </div>

                <!-- 父目标 -->
                <div class="property-item">
                  <div class="property-label">
                    <span class="property-icon">🎯</span>
                    <span>父目标</span>
                  </div>
                  <div class="property-value">
                    <ParentGoalSelector v-model="form.parentGoal" :exclude-goal-id="goal?.id"
                      @update:modelValue="onContentChange" />
                  </div>
                </div>

                <!-- 周期 -->
                <div class="property-item">
                  <div class="property-label">
                    <span class="property-icon">🔄</span>
                    <span>周期</span>
                  </div>
                  <div class="property-value">
                    <PeriodSelector v-model:period-type="form.periodType" v-model:period-value="form.periodValue"
                      @update:period-type="onContentChange" @update:period-value="onContentChange" />
                  </div>
                </div>

                <!-- 计划开始 -->
                <div class="property-item">
                  <div class="property-label">
                    <span class="property-icon">📅</span>
                    <span>计划开始</span>
                  </div>
                  <input v-model="form.plannedStart" type="datetime-local" step="1" class="property-input"
                    @change="onContentChange" />
                </div>

                <!-- 计划结束 -->
                <div class="property-item">
                  <div class="property-label">
                    <span class="property-icon">🏁</span>
                    <span>计划结束</span>
                  </div>
                  <input v-model="form.plannedEnd" type="datetime-local" step="1" class="property-input"
                    @change="onContentChange" />
                </div>

                <!-- 下次执行 -->
                <div class="property-item">
                  <div class="property-label">
                    <span class="property-icon">⏰</span>
                    <span>下次执行</span>
                  </div>
                  <input v-model="form.nextExecution" type="datetime-local" step="1" class="property-input"
                    @change="onContentChange" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 删除确认弹框 -->
    <Transition name="fade">
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
            <button type="button" class="btn-secondary" @click="showDeleteConfirm = false">
              取消
            </button>
            <button type="button" class="btn-danger" :disabled="deleting" @click="handleDelete">
              {{ deleting ? '删除中...' : '确认删除' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import NotionEditor from './NotionEditor.vue'
import FolderSelector from './FolderSelector.vue'
import ParentGoalSelector from './ParentGoalSelector.vue'
import PeriodSelector from './PeriodSelector.vue'

// Refs
const titleInputRef = ref<HTMLInputElement>()
const editorRef = ref<InstanceType<typeof NotionEditor>>()

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
  icon?: string | null
  folderId?: string | null
}

interface Props {
  show: boolean
  goal?: Goal
  defaults?: {
    folderId: string | null
    periodType: string
    periodValue: string
    parentGoal?: Goal | null
  } | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  saved: []
  deleted: []
}>()

// 表单数据
const form = ref({
  folderId: null as string | null,
  title: '',
  description: '',
  status: 'NOT_STARTED' as GoalStatus,
  periodType: '' as PeriodType,
  periodValue: '',
  plannedStart: '',
  plannedEnd: '',
  nextExecution: '',
  parentGoal: null as Goal | null,
  icon: '🎯'
})

const loading = ref(false)
const deleting = ref(false)
const saving = ref(false)
const lastSaved = ref('')
const showDeleteConfirm = ref(false)
const showEmojiPicker = ref(false)
const isFullscreen = ref(false)

// 文件夹列表
const folders = ref<any[]>([])

// 计算属性
const folderName = computed(() => {
  if (!form.value.folderId) return ''
  const folder = folders.value.find(f => f.id === form.value.folderId)
  return folder?.name || ''
})

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

// 加载文件夹
const loadFolders = async () => {
  try {
    const response = await $fetch<any>('/api/folders')
    if (response.success) {
      folders.value = response.data
    }
  } catch (err) {
    console.error('加载文件夹失败:', err)
  }
}

// Emoji 选择
const selectEmoji = (emoji: string) => {
  form.value.icon = emoji
  showEmojiPicker.value = false
  scheduleAutoSave()
}

// 聚焦编辑器
const focusEditor = () => {
  nextTick(() => {
    if (editorRef.value?.editor) {
      editorRef.value.editor.chain().focus().run()
    }
  })
}

// 自动保存
let autoSaveTimer: ReturnType<typeof setTimeout> | null = null

const scheduleAutoSave = () => {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }

  autoSaveTimer = setTimeout(() => {
    autoSave()
  }, 1000)
}

const autoSave = async (): Promise<{ success: boolean; error?: string }> => {
  if (!form.value.title.trim() && !form.value.description.trim()) {
    return { success: false }
  }

  saving.value = true

  try {
    const payload = {
      folderId: form.value.folderId || undefined,
      title: form.value.title || '无标题',
      description: form.value.description || undefined,
      status: form.value.status,
      parentId: form.value.parentGoal?.id || null,
      icon: form.value.icon || undefined
    }

    // 只有在有周期类型时才添加周期字段
    if (form.value.periodType) {
      (payload as any).periodType = form.value.periodType
        (payload as any).periodValue = form.value.periodValue
    }

    // 添加时间规划字段
    if (form.value.plannedStart) {
      (payload as any).plannedStart = new Date(form.value.plannedStart).toISOString()
    }
    if (form.value.plannedEnd) {
      (payload as any).plannedEnd = new Date(form.value.plannedEnd).toISOString()
    }
    if (form.value.nextExecution) {
      (payload as any).nextExecution = new Date(form.value.nextExecution).toISOString()
    }

    if (props.goal?.id) {
      await $fetch<any>(`/api/goals/${props.goal.id}`, {
        method: 'PATCH',
        body: payload
      })
    } else {
      const response = await $fetch<any>('/api/goals', {
        method: 'POST',
        body: payload
      })
      if (response.success) {
        emit('saved')
        return { success: true }
      }
    }

    // 更新保存时间
    lastSaved.value = new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })

    return { success: true }
  } catch (err: any) {
    console.error('保存失败:', err)
    const message = err.data?.error || err.message || '保存失败'
    return { success: false, error: message }
  } finally {
    saving.value = false
  }
}

// 内容变化处理
const onContentChange = () => {
  scheduleAutoSave()
}

// 保存
const handleSave = async () => {
  if (!form.value.title.trim() && !form.value.description.trim()) {
    const { error } = useToast()
    error('请至少填写标题或描述')
    return
  }

  loading.value = true

  try {
    const result = await autoSave()

    if (result.success) {
      emit('saved')
      emit('close')
    } else if (result.error) {
      const { error } = useToast()
      error(result.error)
    } else {
      // 没有内容可保存
      emit('close')
    }
  } catch (err: any) {
    const message = err.data?.error || err.message || '保存失败'
    const { error } = useToast()
    error(message)
  } finally {
    loading.value = false
  }
}

// 删除
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

// 关闭
const handleClose = async () => {
  // 如果有内容且未保存，提示用户
  if ((form.value.title.trim() || form.value.description.trim()) && !lastSaved.value && !props.goal?.id) {
    const confirmed = confirm('您有未保存的内容，确定要关闭吗？')
    if (!confirmed) {
      return
    }
  }

  emit('close')
}

// 点击外部关闭 Emoji 选择器
const handleClickOutside = (e: MouseEvent) => {
  if (showEmojiPicker.value) {
    const target = e.target as HTMLElement
    if (!target.closest('.emoji-picker') && !target.closest('.icon-btn')) {
      showEmojiPicker.value = false
    }
  }
}

// 键盘快捷键
const handleKeyDown = (e: KeyboardEvent) => {
  // Ctrl/Cmd + S 保存
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    handleSave()
  }
  // Esc 关闭（如果编辑器没有焦点）
  if (e.key === 'Escape' && !editorRef.value?.editor?.isFocused) {
    handleClose()
  }
}

// 监听 goal 变化
watch(() => props.goal, (g) => {
  if (g) {
    form.value.folderId = (g as any).folderId || null
    form.value.title = g.title
    form.value.description = g.description || ''
    form.value.status = g.status || 'NOT_STARTED'
    form.value.periodType = g.periodType || ''
    form.value.periodValue = g.periodValue || ''
    form.value.plannedStart = isoToDateTimeLocal(g.plannedStart)
    form.value.plannedEnd = isoToDateTimeLocal(g.plannedEnd)
    form.value.nextExecution = isoToDateTimeLocal(g.nextExecution)
    form.value.parentGoal = g.parent || null
    form.value.icon = g.icon || '🎯'
  } else {
    form.value.folderId = null
    form.value.title = ''
    form.value.description = ''
    form.value.status = 'NOT_STARTED'
    form.value.periodType = ''
    form.value.periodValue = ''
    form.value.plannedStart = ''
    form.value.plannedEnd = ''
    form.value.nextExecution = ''
    form.value.parentGoal = null
    form.value.icon = '🎯'
  }
}, { immediate: true })

// 监听 defaults 变化
watch(() => [props.show, props.defaults], ([isShow, defaults]) => {
  if (isShow && defaults && !props.goal) {
    form.value.folderId = defaults.folderId
    form.value.periodType = defaults.periodType as PeriodType
    form.value.periodValue = defaults.periodValue
    if (defaults.parentGoal !== undefined) {
      form.value.parentGoal = defaults.parentGoal
    }
  }
}, { immediate: true })

// 监听抽屉打开状态，自动聚焦
watch(() => props.show, (isShow) => {
  if (isShow) {
    nextTick(() => {
      // 如果是新增，聚焦到编辑器；否则聚焦到标题输入框
      if (!props.goal?.id) {
          titleInputRef.value?.focus()
      } else {
        // 如果没有标题内容
        if (!titleInputRef.value?.value) {
          titleInputRef.value?.focus()
        }
        // focusEditor()
        // // 如果有标题内容，选中全部文本以便快速修改
        // if (titleInputRef.value?.value) {
        //   titleInputRef.value.select()
        // }
      }
    })
  }
})

// 组件挂载
onMounted(() => {
  loadFolders()
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
})

// 组件卸载
onUnmounted(() => {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
/* 抽屉动画 */
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .goal-drawer,
.drawer-leave-to .goal-drawer {
  transform: translateX(100%);
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 遮罩层 */
.goal-drawer-overlay {
  @apply fixed inset-0 bg-black bg-opacity-30 z-[9999];
}

.goal-drawer {
  @apply fixed right-0 top-0 bottom-0 bg-white shadow-2xl flex flex-col;
  width: 100%;
  transform: translateX(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.goal-drawer.is-fullscreen {
  max-width: 100vw !important;
}

/* 顶部工具栏 */
.drawer-header {
  @apply flex items-center justify-between px-4 py-3 border-b border-gray-200;
  flex-shrink: 0;
  height: 56px;
}

.header-left {
  @apply flex items-center gap-3;
}

.header-right {
  @apply flex items-center gap-3;
}

.header-btn {
  @apply w-9 h-9 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 transition-colors duration-150;
}

.header-btn-danger {
  @apply text-red-500 hover:bg-red-50 hover:text-red-600;
}

.header-btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.header-btn-primary:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.header-breadcrumb {
  @apply flex items-center gap-1.5 text-sm text-gray-600;
}

.breadcrumb-current {
  @apply text-gray-900 font-medium;
}

.save-status {
  @apply text-xs text-gray-500;
}

.save-saving {
  @apply text-blue-600;
}

.save-saved {
  @apply text-green-600;
}

.save-unsaved {
  @apply text-gray-400;
}

/* 主内容区 */
.drawer-content {
  @apply flex-1 flex overflow-hidden;
}

/* 编辑器容器 */
.editor-container {
  @apply flex-1 overflow-y-auto px-8 py-6;
  max-width: 700px;
}

.editor-container::-webkit-scrollbar {
  width: 8px;
}

.editor-container::-webkit-scrollbar-track {
  background: transparent;
}

.editor-container::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded;
}

.editor-container::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}

/* 图标选择器 */
.icon-picker-wrapper {
  @apply relative mb-4;
}

.icon-btn {
  @apply text-6xl hover:bg-gray-100 rounded p-2 transition-colors duration-150 cursor-pointer;
}

.emoji-picker {
  @apply absolute top-0 left-0 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-10;
}

.emoji-grid {
  @apply grid grid-cols-10 gap-1 w-72;
}

.emoji-item {
  @apply w-8 h-8 flex items-center justify-center text-2xl hover:bg-gray-100 rounded transition-colors duration-150;
}

/* 标题输入 */
.title-input {
  @apply w-full text-4xl font-bold text-gray-900 placeholder-gray-300 focus:outline-none mb-6;
}

.title-input::placeholder {
  @apply text-gray-300;
}

/* Notion 编辑器包装器 - 无边框 */
.notion-editor-wrapper {
  @apply relative;
}

.notion-editor-wrapper :deep(.notion-editor) {
  @apply bg-transparent;
}

.notion-editor-wrapper :deep(.editor-content) {
  @apply bg-transparent;
}

.notion-editor-wrapper :deep(.ProseMirror) {
  @apply p-0 min-h-[200px];
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  line-height: 1.7;
  color: #37352f;
}

.notion-editor-wrapper :deep(.ProseMirror p) {
  @apply my-1;
}

.notion-editor-wrapper :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  @apply text-gray-400 pointer-events-none float-left h-0;
}

/* 属性面板 */
.properties-panel {
  @apply w-96 bg-gray-50 border-l border-gray-200 overflow-y-auto flex-shrink-0;
}

.properties-panel::-webkit-scrollbar {
  width: 8px;
}

.properties-panel::-webkit-scrollbar-track {
  background: transparent;
}

.properties-panel::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded;
}

.properties-panel::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}

.properties-header {
  @apply flex items-center justify-between px-4 py-3 border-b border-gray-200;
}

.properties-title {
  @apply text-xs font-semibold text-gray-500 uppercase tracking-wide;
}

.properties-list {
  @apply py-2;
}

.property-item {
  @apply flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 transition-colors duration-150;
}

.property-label {
  @apply flex items-center gap-2 w-20 flex-shrink-0 text-sm text-gray-600;
}

.property-icon {
  @apply text-base;
}

.property-select,
.property-input {
  @apply flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.property-value {
  @apply flex-1;
}

.property-value :deep(.folder-selector),
.property-value :deep(.parent-goal-selector),
.property-value :deep(.period-selector) {
  @apply w-full;
}

/* 删除确认弹框 */
.confirm-dialog-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000];
}

.confirm-dialog {
  @apply bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden;
}

.confirm-dialog-header {
  @apply px-6 py-4 border-b border-gray-200;
}

.confirm-dialog-header h3 {
  @apply text-lg font-semibold text-gray-900;
  margin: 0;
}

.confirm-dialog-body {
  @apply px-6 py-4;
}

.confirm-dialog-body p {
  @apply text-sm text-gray-700 mb-0;
  line-height: 1.5;
}

.warning-text {
  @apply text-red-600 text-xs mt-2 !important;
}

.confirm-dialog-footer {
  @apply px-6 py-4 bg-gray-50 flex items-center justify-end gap-3;
}

.confirm-dialog-footer button {
  @apply px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150;
}

.btn-secondary {
  @apply bg-white border border-gray-300 text-gray-700 hover:bg-gray-50;
}

.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed;
}

/* 响应式 */
@media (max-width: 768px) {
  .goal-drawer {
    @apply max-w-full;
  }

  .properties-panel {
    @apply hidden;
  }

  .editor-container {
    @apply px-6 py-4;
  }

  .title-input {
    @apply text-3xl;
  }
}
</style>
