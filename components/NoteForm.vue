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

        <form @submit.prevent="handleSubmit" class="note-form-body">
          <!-- 标题 -->
          <div class="note-form-field">
            <label for="note-title" class="note-form-label">标题</label>
            <input
              id="note-title"
              v-model="formData.title"
              type="text"
              class="note-form-input"
              placeholder="输入笔记标题"
              required
              maxlength="200"
            />
          </div>

          <!-- 文件夹 -->
          <div class="note-form-field">
            <label for="note-folder" class="note-form-label">文件夹</label>
            <select
              id="note-folder"
              v-model="formData.folderId"
              class="note-form-input"
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

          <!-- 标签 -->
          <div class="note-form-field">
            <label for="note-tags" class="note-form-label">标签</label>
            <div class="note-form-tags-input">
              <div v-if="formData.tags.length > 0" class="note-form-tags-list">
                <span
                  v-for="(tag, index) in formData.tags"
                  :key="index"
                  class="note-form-tag"
                >
                  {{ tag }}
                  <button
                    type="button"
                    @click="removeTag(index)"
                    class="note-form-tag-remove"
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
                class="note-form-tag-input"
                placeholder="输入标签后按回车添加"
                @keydown.enter.prevent="addTag"
              />
            </div>
          </div>

          <!-- 内容 -->
          <div class="note-form-field">
            <label class="note-form-label">内容</label>
            <RichTextEditor
              v-model="formData.content"
              placeholder="开始编写笔记内容..."
              :min-height="'300px'"
            />
          </div>
        </form>

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
      tags: note.tags || []
    }
  }
}, { immediate: true })

// 监听folderId变化（新建时）
watch(() => props.folderId, (folderId) => {
  if (folderId && !isEdit.value) {
    formData.value.folderId = folderId
  }
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
  @apply bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col;
}

.note-form-header {
  @apply flex items-center justify-between px-6 py-4 border-b border-gray-200;
}

.note-form-title {
  @apply text-lg font-semibold text-gray-900;
}

.note-form-close {
  @apply text-gray-400 hover:text-gray-600 transition-colors duration-150;
}

.note-form-body {
  @apply flex-1 overflow-y-auto px-6 py-4 space-y-4;
}

.note-form-field {
  @apply space-y-2;
}

.note-form-label {
  @apply block text-sm font-medium text-gray-700;
}

.note-form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.note-form-tags-input {
  @apply border border-gray-300 rounded-md p-2 space-y-2;
}

.note-form-tags-list {
  @apply flex flex-wrap gap-2;
}

.note-form-tag {
  @apply inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-full;
}

.note-form-tag-remove {
  @apply hover:bg-blue-100 rounded-full p-0.5;
}

.note-form-tag-input {
  @apply w-full px-2 py-1 focus:outline-none;
}

.note-form-footer {
  @apply px-6 py-4 bg-gray-50 flex items-center justify-between gap-4 border-t border-gray-200;
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
