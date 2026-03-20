<template>
  <div class="note-list">
    <div class="note-list-header">
      <h2 class="note-list-title">我的笔记</h2>
      <FolderTreeMultiSelect
        v-model="selectedFolderIds"
        class="w-[200px] ml-3"
        @update:model-value="loadNotes"
      />
      <div class="flex-1"></div>
      <button
        @click="handleCreate"
        class="btn-primary"
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        新建笔记
      </button>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="note-list-loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="note-list-error">
      {{ error }}
      <button @click="loadNotes" class="btn-secondary" type="button">重试</button>
    </div>

    <!-- 笔记列表 -->
    <div v-else-if="notes.length === 0" class="note-list-empty">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
      <p>还没有笔记，点击"新建笔记"开始创建</p>
    </div>

    <!-- 笔记卡片列表 -->
    <div v-else ref="noteListRef" class="note-list-cards">
      <div
        v-for="note in sortedNotes"
        :key="note.id"
        class="note-card"
        :class="{ 'note-card-pinned': note.isPinned }"
        @click="handleEdit(note)"
      >
        <div class="note-card-icon">
          {{ note.icon || '📄' }}
        </div>

        <div class="note-card-content">
          <div class="note-card-header">
            <h3 class="note-card-title">{{ note.title }}</h3>
            <div class="note-card-actions">
            <button
              @click.stop="togglePin(note)"
              class="note-card-action"
              :title="note.isPinned ? '取消置顶' : '置顶'"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="17" x2="12" y2="22"/>
                <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>
              </svg>
            </button>
            <button
              @click.stop="handleDelete(note)"
              class="note-card-action note-card-action-danger"
              title="删除"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="note-card-preview">
          {{ getPreviewText(note.content) }}
        </div>

        <div class="note-card-footer">
          <div v-if="note.tags && note.tags.length > 0" class="note-card-tags">
            <span
              v-for="tag in note.tags"
              :key="tag"
              class="note-card-tag"
            >
              {{ tag }}
            </span>
          </div>
          <div class="note-card-meta">
            <span v-if="note.folder" class="note-card-folder">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              {{ note.folder.name }}
            </span>
            <span class="note-card-date">
              {{ formatDate(note.updatedAt) }}
            </span>
          </div>
        </div>
        </div>
      </div>
    </div>

    <!-- 笔记编辑对话框 -->
    <NoteEditorNotion
      v-if="showForm"
      :note="currentNote"
      :folder-ids="selectedFolderIds"
      @close="closeForm"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import FolderTreeMultiSelect from './FolderTreeMultiSelect.vue'
import NoteEditorNotion from './NoteEditorNotion.vue'
import Sortable from 'sortablejs'

interface Note {
  id: string
  title: string
  content: string | null
  tags: string[]
  icon?: string | null
  isPinned: boolean
  sortOrder: number
  folder: { id: string; name: string } | null
  updatedAt: string
}

const notes = ref<Note[]>([])
const loading = ref(false)
const error = ref('')
const selectedFolderIds = ref<string[]>([])
const showForm = ref(false)
const currentNote = ref<Note | null>(null)
const noteListRef = ref<HTMLElement | null>(null)
let sortableInstance: Sortable | null = null

const sortedNotes = computed(() => {
  return [...notes.value].sort((a, b) => {
    // 使用sortOrder作为主要排序字段（升序）
    return a.sortOrder - b.sortOrder
  })
})

const loadNotes = async () => {
  loading.value = true
  error.value = ''

  try {
    const params = new URLSearchParams()
    if (selectedFolderIds.value.length > 0) {
      selectedFolderIds.value.forEach(id => {
        params.append('folderIds', id)
      })
    }

    const response = await $fetch<any>(`/api/notes?${params.toString()}`)

    if (response.success) {
      notes.value = response.data
    } else {
      throw new Error('获取笔记列表失败')
    }
  } catch (err: any) {
    error.value = err.message || '加载失败'
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  currentNote.value = null
  showForm.value = true
}

const handleEdit = (note: Note) => {
  currentNote.value = note
  showForm.value = true
}

const handleSave = () => {
  closeForm()
  loadNotes()
}

const closeForm = () => {
  showForm.value = false
  currentNote.value = null
}

const togglePin = async (note: Note) => {
  try {
    await $fetch<any>(`/api/notes/${note.id}/pin`, {
      method: 'PUT'
    })

    await loadNotes()
  } catch (err: any) {
    error.value = err.message || '操作失败'
  }
}

const handleDelete = async (note: Note) => {
  if (!confirm(`确定要删除笔记"${note.title}"吗？`)) {
    return
  }

  try {
    await $fetch<any>(`/api/notes/${note.id}`, {
      method: 'DELETE'
    })

    await loadNotes()
  } catch (err: any) {
    error.value = err.message || '删除失败'
  }
}

const getPreviewText = (content: string | null): string => {
  if (!content) return '无内容'

  // 移除HTML标签
  const text = content.replace(/<[^>]*>/g, '').trim()
  const maxLength = 150

  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return '今天'
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

// 初始化拖拽排序
const initSortable = () => {
  if (sortableInstance) {
    sortableInstance.destroy()
  }

  nextTick(() => {
    if (noteListRef.value) {
      sortableInstance = Sortable.create(noteListRef.value, {
        animation: 150,
        ghostClass: 'note-card-ghost',
        dragClass: 'note-card-drag',
        onEnd: async (evt: any) => {
          const { oldIndex, newIndex } = evt

          if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) {
            return
          }

          // 重新排序笔记数组
          const newNotes = [...sortedNotes.value]
          const [movedNote] = newNotes.splice(oldIndex, 1)
          if (!movedNote) return

          newNotes.splice(newIndex, 0, movedNote)

          // 计算新的sortOrder值
          const notesWithNewOrder = newNotes.map((note, index) => ({
            id: note.id,
            sortOrder: index
          }))

          try {
            await $fetch<any>('/api/notes/reorder', {
              method: 'PUT',
              body: {
                notes: notesWithNewOrder
              }
            })

            // 重新加载笔记列表
            await loadNotes()
          } catch (err: any) {
            error.value = err.message || '排序失败'
            // 如果失败，重新加载以恢复原状
            await loadNotes()
          }
        }
      })
    }
  })
}

// 监听笔记列表变化，重新初始化拖拽
watch([notes, loading], () => {
  if (!loading.value && notes.value.length > 0) {
    initSortable()
  }
})

onMounted(() => {
  loadNotes()
})
</script>

<style scoped>
.note-list {
  @apply space-y-6;
}

.note-list-header {
  @apply flex items-center justify-between;
}

.note-list-title {
  @apply text-2xl font-bold text-gray-900;
}

.btn-primary {
  @apply flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 font-medium;
}

.btn-secondary {
  @apply px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-150;
}

.note-list-filters {
  @apply flex items-center gap-4;
}

.note-list-loading,
.note-list-error,
.note-list-empty {
  @apply flex flex-col items-center justify-center py-12 text-gray-500;
}

.note-list-error button {
  @apply mt-4;
}

.spinner {
  @apply w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin;
}

.note-list-cards {
  @apply flex flex-col gap-3;
}

.note-card {
  @apply bg-white border border-gray-200 rounded-lg p-4 cursor-move hover:shadow-md hover:border-blue-300 transition-all duration-150 flex items-start gap-4;
}

.note-card-pinned {
  @apply border-l-4 border-l-blue-600;
}

.note-card-ghost {
  @apply opacity-50 bg-gray-100;
}

.note-card-drag {
  @apply shadow-xl scale-105;
}

.note-card-icon {
  @apply text-3xl flex-shrink-0;
}

.note-card-content {
  @apply flex-1 min-w-0;
}

.note-card-header {
  @apply flex items-start justify-between gap-2 min-w-0;
}

.note-card-title {
  @apply text-base font-semibold text-gray-900 truncate;
}

.note-card-actions {
  @apply flex items-center gap-1 flex-shrink-0;
}

.note-card-action {
  @apply w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors duration-150;
}

.note-card-action-danger {
  @apply hover:bg-red-50 hover:text-red-600;
}

.note-card-preview {
  @apply text-sm text-gray-600 line-clamp-2 mt-2;
}

.note-card-footer {
  @apply flex flex-col items-start gap-2 mt-2;
}

.note-card-tags {
  @apply flex items-center gap-1 flex-wrap;
}

.note-card-tag {
  @apply px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full;
}

.note-card-meta {
  @apply flex flex-col items-start gap-1 text-xs text-gray-500;
}

.note-card-folder {
  @apply flex items-center gap-1 font-medium;
}

.note-card-date {
  @apply whitespace-nowrap;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
