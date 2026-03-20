<template>
  <Teleport to="body">
    <div class="note-form-overlay" @click.self="handleClose">
      <div class="note-form-dialog">
        <div class="note-form-header">
          <h2 class="note-form-title">
            {{ isEdit ? '编辑笔记' : '新建笔记' }}
          </h2>
          <button @click="handleClose" class="note-form-close" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="note-form-three-columns">
          <!-- 左侧：文件夹目录 -->
          <div class="note-form-left-panel">
            <div class="panel-header">
              <h3 class="panel-title">文件夹</h3>
            </div>
            <div class="folder-tree">
              <div
                v-for="folder in folders"
                :key="folder.id"
                @click="selectFolder(folder.id)"
                :class="['folder-item', { active: formData.folderId === folder.id }]"
              >
                <svg class="folder-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                <span class="folder-name">{{ folder.name }}</span>
              </div>
              <div
                @click="selectFolder('')"
                :class="['folder-item', { active: formData.folderId === '' }]"
              >
                <svg class="folder-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                <span class="folder-name">无文件夹</span>
              </div>
            </div>
          </div>

          <!-- 中间：标题 + 编辑器 -->
          <form @submit.prevent="handleSubmit" class="note-form-middle-panel">
            <div class="editor-section">
              <!-- 标题 -->
              <div class="title-field">
                <input
                  v-model="formData.title"
                  type="text"
                  class="title-input"
                  placeholder="输入笔记标题"
                  required
                  maxlength="200"
                />
              </div>

              <!-- 标签 -->
              <div class="tags-field">
                <div class="tags-input">
                  <div v-if="formData.tags.length > 0" class="tags-list">
                    <span
                      v-for="(tag, index) in formData.tags"
                      :key="index"
                      class="tag"
                    >
                      {{ tag }}
                      <button
                        type="button"
                        @click="removeTag(index)"
                        class="tag-remove"
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
                    type="text"
                    class="tag-input"
                    placeholder="输入标签后按回车添加"
                    @keydown.enter.prevent="addTag"
                  />
                </div>
              </div>

              <!-- 内容编辑器 -->
              <div class="content-field">
                <RichTextEditor
                  v-model="formData.content"
                  placeholder="开始编写笔记内容..."
                  :min-height="'500px'"
                />
              </div>
            </div>
          </form>

          <!-- 右侧：树形编辑器（大纲） -->
          <div class="note-form-right-panel">
            <div class="panel-header">
              <h3 class="panel-title">大纲</h3>
            </div>
            <div class="outline-tree">
              <div v-if="outlineItems.length > 0">
                <div
                  v-for="(item, index) in outlineItems"
                  :key="index"
                  @click="scrollToHeading(item)"
                  :class="['outline-item', `level-${item.level}`]"
                  :style="{ paddingLeft: `${(item.level - 1) * 12 + 8}px` }"
                >
                  {{ item.text }}
                </div>
              </div>
              <div v-else class="outline-empty">
                <p>添加标题生成大纲</p>
              </div>
            </div>
          </div>
        </div>

        <div class="note-form-footer">
          <button
            @click="handleClose"
            class="note-form-btn note-form-btn-secondary"
            type="button"
          >
            取消
          </button>
          <button
            @click="handleSubmit"
            class="note-form-btn note-form-btn-primary"
            type="button"
            :disabled="saving"
          >
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import RichTextEditor from './RichTextEditor.vue'

interface Props {
  note?: any
  folderId?: string
}

interface Folder {
  id: string
  name: string
}

interface OutlineItem {
  text: string
  level: number
  id: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: []
}>()

const formData = ref({
  title: '',
  content: '',
  folderId: '',
  tags: [] as string[]
})

const tagInput = ref('')
const folders = ref<Folder[]>([])
const saving = ref(false)
const error = ref('')
const outlineItems = ref<OutlineItem[]>([])

const isEdit = computed(() => !!props.note)

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

const selectFolder = (folderId: string) => {
  formData.value.folderId = folderId
}

const addTag = () => {
  const tag = tagInput.value.trim()

  if (tag && !formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag)
  }

  tagInput.value = ''
}

const removeTag = (index: number) => {
  formData.value.tags.splice(index, 1)
}

const generateOutline = () => {
  const content = formData.value.content

  // 提取标题（H1-H6）
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const items: OutlineItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    items.push({
      text,
      level,
      id: `heading-${items.length}`
    })
  }

  outlineItems.value = items
}

const scrollToHeading = (item: OutlineItem) => {
  // 实现滚动到对应标题的逻辑
  console.log('Scrolling to:', item)
}

const handleClose = () => {
  emit('close')
}

const handleSubmit = async () => {
  if (!formData.value.title.trim()) {
    error.value = '标题不能为空'
    return
  }

  saving.value = true
  error.value = ''

  try {
    if (isEdit.value) {
      await $fetch<any>(`/api/notes/${props.note.id}`, {
        method: 'PUT',
        body: {
          title: formData.value.title,
          content: formData.value.content,
          folderId: formData.value.folderId || null,
          tags: formData.value.tags
        }
      })
    } else {
      await $fetch<any>('/api/notes', {
        method: 'POST',
        body: {
          title: formData.value.title,
          content: formData.value.content || '',
          folderId: formData.value.folderId || null,
          tags: formData.value.tags
        }
      })
    }

    emit('save')
  } catch (err: any) {
    error.value = err.message || '保存失败'
  } finally {
    saving.value = false
  }
}

// 监听note变化，初始化表单
watch(() => props.note, (note) => {
  if (note) {
    formData.value = {
      title: note.title || '',
      content: note.content || '',
      folderId: note.folderId || '',
      tags: note.tags ?? []
    }
  }
}, { immediate: true })

// 监听folderId变化（新建时）
watch(() => props.folderId, (folderId) => {
  if (folderId && !isEdit.value) {
    formData.value.folderId = folderId
  }
}, { immediate: true })

// 监听内容变化，生成大纲
watch(() => formData.value.content, () => {
  generateOutline()
}, { immediate: true })

onMounted(() => {
  loadFolders()
})
</script>

<style scoped>
.note-form-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4;
}

.note-form-dialog {
  @apply bg-white rounded-lg shadow-xl w-full max-w-[95vw] h-[90vh] flex flex-col;
}

.note-form-header {
  @apply flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0;
}

.note-form-title {
  @apply text-lg font-semibold text-gray-900;
}

.note-form-close {
  @apply text-gray-400 hover:text-gray-600 transition-colors duration-150;
}

/* 三栏布局 */
.note-form-three-columns {
  @apply flex flex-1 overflow-hidden;
}

/* 左侧面板 */
.note-form-left-panel {
  @apply w-64 border-r border-gray-200 flex flex-col flex-shrink-0;
}

.panel-header {
  @apply px-4 py-3 border-b border-gray-200 bg-gray-50;
}

.panel-title {
  @apply text-sm font-semibold text-gray-700;
}

.folder-tree {
  @apply flex-1 overflow-y-auto p-2 space-y-1;
}

.folder-item {
  @apply flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-150;
}

.folder-item.active {
  @apply bg-blue-50 text-blue-600;
}

.folder-icon {
  @apply flex-shrink-0;
}

.folder-name {
  @apply text-sm truncate;
}

/* 中间面板 */
.note-form-middle-panel {
  @apply flex-1 flex flex-col overflow-hidden;
}

.editor-section {
  @apply flex-1 overflow-y-auto p-6 space-y-4;
}

.title-field {
  @apply space-y-2;
}

.title-input {
  @apply w-full px-4 py-3 text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.tags-field {
  @apply space-y-2;
}

.tags-input {
  @apply border border-gray-300 rounded-lg p-3 space-y-2;
}

.tags-list {
  @apply flex flex-wrap gap-2;
}

.tag {
  @apply inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full;
}

.tag-remove {
  @apply hover:bg-blue-100 rounded-full p-0.5;
}

.tag-input {
  @apply w-full px-2 py-1.5 focus:outline-none;
}

.content-field {
  @apply space-y-2;
}

/* 右侧面板 */
.note-form-right-panel {
  @apply w-72 border-l border-gray-200 flex flex-col flex-shrink-0;
}

.outline-tree {
  @apply flex-1 overflow-y-auto p-3;
}

.outline-item {
  @apply py-2 px-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors duration-150 truncate;
}

.outline-item.level-1 {
  @apply font-semibold;
}

.outline-item.level-2 {
  @apply text-gray-600;
}

.outline-item.level-3 {
  @apply text-gray-500 text-xs;
}

.outline-empty {
  @apply flex items-center justify-center h-full text-gray-400 text-sm;
}

.note-form-footer {
  @apply px-6 py-4 bg-gray-50 flex items-center justify-between gap-4 border-t border-gray-200 flex-shrink-0;
}

.note-form-btn {
  @apply px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150;
}

.note-form-btn-secondary {
  @apply bg-white border border-gray-300 text-gray-700 hover:bg-gray-50;
}

.note-form-btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>
