<template>
  <Teleport to="body">
    <div class="notion-editor" :class="{ 'is-fullscreen': isFullscreen }">
      <!-- 侧边栏 -->
      <div v-if="showSidebar" class="notion-sidebar">
        <div class="sidebar-header">
          <button @click="handleClose" class="sidebar-close-btn" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="sidebar-content">
          <div class="sidebar-section">
            <div class="sidebar-section-title">页面</div>
            <div class="sidebar-menu">
              <button
                @click="toggleProperties"
                :class="{ 'is-active': showProperties }"
                class="sidebar-menu-item"
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="9" y1="3" x2="9" y2="21"/>
                </svg>
                <span>属性</span>
              </button>
            </div>
          </div>

          <div v-if="folderName" class="sidebar-section">
            <div class="sidebar-section-title">位置</div>
            <div class="sidebar-folder">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              <span>{{ folderName }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 主内容区 -->
      <div class="notion-main" :class="{ 'has-sidebar': showSidebar }">
        <!-- 顶部工具栏 -->
        <div class="notion-header">
          <div class="header-left">
            <button
              v-if="!showSidebar"
              @click="showSidebar = true"
              class="header-btn"
              type="button"
              title="显示侧边栏"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
              </svg>
            </button>

            <div class="header-breadcrumb">
              <span v-if="folderName">{{ folderName }}</span>
              <span v-else>无文件夹</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              <span class="breadcrumb-current">笔记</span>
            </div>
          </div>

          <div class="header-center">
            <button
              v-if="!showProperties"
              @click="showProperties = true"
              class="header-btn"
              type="button"
              title="显示属性"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
              </svg>
            </button>
          </div>

          <div class="header-right">
            <div class="save-status">
              <span v-if="saving" class="save-saving">保存中...</span>
              <span v-else-if="lastSaved" class="save-saved">已保存 {{ lastSaved }}</span>
              <span v-else class="save-unsaved">未保存</span>
            </div>

            <button
              @click="handleClose"
              class="header-btn header-btn-danger"
              type="button"
              title="关闭"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 编辑器容器 -->
        <div class="notion-content">
          <!-- 页面图标和标题 -->
          <div class="page-cover">
            <button
              @click="showEmojiPicker = !showEmojiPicker"
              class="page-icon"
              type="button"
            >
              {{ pageIcon || '📄' }}
            </button>

            <!-- Emoji 选择器 -->
            <div v-if="showEmojiPicker" class="emoji-picker" @click.stop>
              <div class="emoji-grid">
                <button
                  v-for="emoji in commonEmojis"
                  :key="emoji"
                  @click="selectEmoji(emoji)"
                  class="emoji-item"
                  type="button"
                >
                  {{ emoji }}
                </button>
              </div>
            </div>
          </div>

          <!-- 页面标题 -->
          <div class="page-title-wrapper">
            <input
              v-model="noteTitle"
              @input="onTitleChange"
              class="page-title"
              placeholder="无标题"
              maxlength="200"
            />
          </div>

          <!-- 分隔线 -->
          <div class="page-divider"></div>

          <!-- 富文本编辑器 -->
          <NotionEditor
            v-model="noteContent"
            :placeholder="'输入 \'/\' 选择格式，或开始编写内容...'"
            :min-height="'400px'"
            @update:modelValue="onContentChange"
          />
        </div>
      </div>

      <!-- 右侧属性编辑栏 -->
      <div v-if="showProperties" class="notion-properties">
        <div class="properties-header">
          <div class="properties-title">属性</div>
          <button
            @click="showProperties = false"
            class="properties-close-btn"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="properties-content">
          <div class="property-section">
            <div class="property-item">
              <div class="property-label">文件夹</div>
              <select
                v-model="folderId"
                @change="onPropertyChange"
                class="property-select"
              >
                <option value="">无文件夹</option>
                <option
                  v-for="folder in folders"
                  :key="folder.id"
                  :value="folder.id"
                >
                  {{ folder.name }}
                </option>
              </select>
            </div>

            <div class="property-item">
              <div class="property-label">标签</div>
              <div class="property-tags">
                <div v-if="tags.length > 0" class="tags-list">
                  <span
                    v-for="(tag, index) in tags"
                    :key="index"
                    class="tag-chip"
                  >
                    {{ tag }}
                    <button
                      @click="removeTag(index)"
                      class="tag-remove"
                      type="button"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </span>
                </div>
                <input
                  v-model="tagInput"
                  @keydown.enter.prevent="addTag"
                  class="tag-input"
                  placeholder="输入标签按回车添加"
                />
              </div>
            </div>

            <div class="property-item">
              <div class="property-label">创建时间</div>
              <div class="property-value">
                {{ formatDate(note?.createdAt) }}
              </div>
            </div>

            <div v-if="note?.updatedAt" class="property-item">
              <div class="property-label">更新时间</div>
              <div class="property-value">
                {{ formatDate(note.updatedAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import NotionEditor from './NotionEditor.vue'

interface Props {
  note?: any
  folderId?: string
  folderIds?: string[]
}

interface Folder {
  id: string
  name: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: []
}>()

// 状态
const showSidebar = ref(true)
const showProperties = ref(true)
const isFullscreen = ref(true)
const showEmojiPicker = ref(false)
const saving = ref(false)
const lastSaved = ref('')

// 表单数据
const noteTitle = ref('')
const noteContent = ref('')
const folderId = ref('')
const tags = ref<string[]>([])
const pageIcon = ref('📄')
const tagInput = ref('')

// 文件夹列表
const folders = ref<Folder[]>([])

// 计算属性
const folderName = computed(() => {
  const folder = folders.value.find(f => f.id === folderId.value)
  return folder?.name || ''
})

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

// 标签操作
const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !tags.value.includes(tag)) {
    tags.value.push(tag)
    tagInput.value = ''
    scheduleAutoSave()
  }
}

const removeTag = (index: number) => {
  tags.value.splice(index, 1)
  scheduleAutoSave()
}

// Emoji 选择
const commonEmojis = [
  '📄', '📝', '📋', '📌', '📎', '✏️', '🖊️', '📚', '📖', '📕',
  '📗', '📘', '📙', '🗂️', '📁', '📂', '🏠', '⭐', '❤️', '🔥',
  '💡', '🎯', '🚀', '💻', '🎨', '🎬', '📷', '🎵', '🎮', '🏆'
]

const selectEmoji = (emoji: string) => {
  pageIcon.value = emoji
  showEmojiPicker.value = false
  scheduleAutoSave()
}

// 格式化日期
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '未知'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
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
  }, 1000) // 1秒后自动保存
}

const autoSave = async () => {
  if (!noteTitle.value.trim() && !noteContent.value.trim()) {
    return
  }

  saving.value = true

  try {
    const payload = {
      title: noteTitle.value || '无标题',
      content: noteContent.value || '',
      folderId: folderId.value || null,
      tags: tags.value,
      icon: pageIcon.value
    }

    if (props.note?.id) {
      await $fetch<any>(`/api/notes/${props.note.id}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      const response = await $fetch<any>('/api/notes', {
        method: 'POST',
        body: payload
      })
      if (response.success) {
        emit('save')
      }
    }

    // 更新保存时间
    lastSaved.value = new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (err: any) {
    console.error('保存失败:', err)
  } finally {
    saving.value = false
  }
}

// 内容变化处理
const onTitleChange = () => {
  scheduleAutoSave()
}

const onContentChange = () => {
  scheduleAutoSave()
}

const onPropertyChange = () => {
  scheduleAutoSave()
}

// 关闭编辑器
const handleClose = () => {
  // 先保存再关闭
  autoSave().then(() => {
    emit('close')
  })
}

// 点击外部关闭 Emoji 选择器
const handleClickOutside = (e: MouseEvent) => {
  if (showEmojiPicker.value) {
    const target = e.target as HTMLElement
    if (!target.closest('.emoji-picker') && !target.closest('.page-icon')) {
      showEmojiPicker.value = false
    }
  }
}

// 初始化
watch(() => props.note, (note) => {
  if (note) {
    noteTitle.value = note.title || ''
    noteContent.value = note.content || ''
    folderId.value = note.folderId || ''
    tags.value = note.tags || []
    pageIcon.value = note.icon || '📄'
  } else {
    // 新建笔记
    noteTitle.value = ''
    noteContent.value = ''
    folderId.value = props.folderId || ''
    tags.value = []
    pageIcon.value = '📄'
  }
}, { immediate: true })

// 监听 folderId/folderIds 变化
watch(() => props.folderId || props.folderIds?.[0], (newFolderId) => {
  if (newFolderId && !props.note) {
    folderId.value = newFolderId
  }
}, { immediate: true })

// 组件挂载
onMounted(() => {
  loadFolders()
  document.addEventListener('click', handleClickOutside)

  // 聚焦标题
  nextTick(() => {
    if (!props.note?.title) {
      const titleInput = document.querySelector('.page-title') as HTMLInputElement
      titleInput?.focus()
    }
  })
})

// 组件卸载
onUnmounted(() => {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.notion-editor {
  @apply fixed inset-0 bg-white z-[9999] flex;
}

/* 侧边栏 */
.notion-sidebar {
  @apply w-60 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0;
}

.sidebar-header {
  @apply flex items-center justify-between px-4 py-3 border-b border-gray-200;
}

.sidebar-close-btn {
  @apply text-gray-400 hover:text-gray-600 transition-colors duration-150;
}

.sidebar-content {
  @apply flex-1 overflow-y-auto p-4;
}

.sidebar-section {
  @apply mb-6;
}

.sidebar-section-title {
  @apply text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2;
}

.sidebar-menu {
  @apply space-y-1;
}

.sidebar-menu-item {
  @apply w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 rounded hover:bg-gray-200 transition-colors duration-150;
}

.sidebar-menu-item.is-active {
  @apply bg-gray-200 font-medium;
}

.sidebar-folder {
  @apply flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600;
}

/* 主内容区 */
.notion-main {
  @apply flex-1 flex flex-col overflow-hidden;
}

.notion-main.has-sidebar {
  @apply ml-0;
}

/* 顶部工具栏 */
.notion-header {
  @apply flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white flex-shrink-0;
}

.header-left {
  @apply flex items-center gap-2;
}

.header-center {
  @apply flex items-center gap-2;
}

.header-right {
  @apply flex items-center gap-3;
}

.header-btn {
  @apply w-8 h-8 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 transition-colors duration-150;
}

.header-btn-danger {
  @apply text-red-500 hover:bg-red-50 hover:text-red-600;
}

.header-breadcrumb {
  @apply flex items-center gap-1 text-sm text-gray-600;
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

/* 编辑器内容 */
.notion-content {
  @apply flex-1 overflow-y-auto;
  position: relative;
  z-index: 0;
}

.notion-content > div {
  @apply max-w-3xl mx-auto px-16 py-12;
  position: relative;
  z-index: 0;
}

/* 页面封面和图标 */
.page-cover {
  @apply mb-4 relative;
  z-index: 1;
}

.page-icon {
  @apply text-6xl hover:bg-gray-100 rounded p-2 transition-colors duration-150 cursor-pointer;
  position: relative;
  z-index: 2;
}

.emoji-picker {
  @apply absolute top-0 left-0 bg-white rounded-lg shadow-xl border border-gray-200 p-3;
  z-index: 100;
}

.emoji-grid {
  @apply grid grid-cols-10 gap-1 w-64;
}

.emoji-item {
  @apply w-6 h-6 flex items-center justify-center text-xl hover:bg-gray-100 rounded transition-colors duration-150;
}

/* 页面标题 */
.page-title-wrapper {
  @apply mb-4;
  position: relative;
  z-index: 1;
}

.page-title {
  @apply w-full text-4xl font-bold text-gray-900 placeholder-gray-300 focus:outline-none;
  position: relative;
  z-index: 2;
}

/* 分隔线 */
.page-divider {
  @apply border-t border-gray-200 my-8;
}

/* 右侧属性编辑栏 */
.notion-properties {
  @apply w-80 bg-gray-50 border-l border-gray-200 flex flex-col flex-shrink-0;
}

.properties-header {
  @apply flex items-center justify-between px-4 py-3 border-b border-gray-200;
}

.properties-title {
  @apply text-sm font-semibold text-gray-700;
}

.properties-close-btn {
  @apply text-gray-400 hover:text-gray-600 transition-colors duration-150;
}

.properties-content {
  @apply flex-1 overflow-y-auto p-4;
}

.property-section {
  @apply space-y-4;
}

.property-item {
  @apply flex flex-col gap-2;
}

.property-label {
  @apply text-xs font-semibold text-gray-600 uppercase tracking-wide;
}

.property-select {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white;
}

.property-value {
  @apply text-sm text-gray-700;
}

.property-tags {
  @apply flex flex-col gap-2;
}

.tags-list {
  @apply flex flex-wrap gap-2;
}

.tag-chip {
  @apply inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-full;
}

.tag-remove {
  @apply hover:bg-blue-100 rounded-full p-0.5 transition-colors duration-150;
}

.tag-input {
  @apply w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500;
}

/* 响应式 */
@media (max-width: 1024px) {
  .notion-properties {
    @apply fixed right-0 top-0 bottom-0 z-20;
  }
}

@media (max-width: 768px) {
  .notion-sidebar {
    @apply fixed left-0 top-0 bottom-0 z-10;
  }

  .notion-content > div {
    @apply px-8 py-8;
  }

  .page-title {
    @apply text-3xl;
  }

  .notion-properties {
    @apply w-full;
  }
}
</style>
