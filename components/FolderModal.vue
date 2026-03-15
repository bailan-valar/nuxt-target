<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="modal-overlay"
      @click.self="$emit('close')"
    >
      <div class="modal-container">
        <div class="modal-header">
          <div>
            <h2>{{ folder?.id ? '编辑文件夹' : '新建文件夹' }}</h2>
            <p v-if="!folder?.id && parentFolderName" class="parent-hint">
              在「{{ parentFolderName }}」下创建子文件夹
            </p>
          </div>
          <button class="close-btn" @click="$emit('close')">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="modal-body">
          <div class="form-field">
            <label for="name">名称 *</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              maxlength="100"
              placeholder="请输入文件夹名称"
            />
          </div>

          <div class="form-field">
            <label for="type">类型 *</label>
            <select id="type" v-model="form.type" required>
              <option value="SCENE">场景</option>
              <option value="GROUP">分组</option>
              <option value="PROJECT">项目</option>
              <option value="SUBPROJECT">子项目</option>
            </select>
          </div>

          <div class="form-field">
            <label for="description">描述</label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              maxlength="500"
              placeholder="请输入文件夹描述（可选）"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label for="icon">图标</label>
              <input
                id="icon"
                v-model="form.icon"
                type="text"
                maxlength="50"
                placeholder="如: folder"
              />
            </div>

            <div class="form-field">
              <label for="color">颜色</label>
              <div class="color-input-group">
                <input
                  id="color-picker"
                  :value="form.color || '#000000'"
                  @input="form.color = ($event.target as HTMLInputElement).value"
                  type="color"
                  class="color-picker"
                />
                <input
                  id="color-text"
                  v-model="form.color"
                  type="text"
                  maxlength="7"
                  placeholder="#FFFFFF"
                  class="color-text"
                />
              </div>
            </div>
          </div>

          <div class="form-field">
            <label for="sortOrder">排序</label>
            <input
              id="sortOrder"
              v-model.number="form.sortOrder"
              type="number"
              min="0"
              placeholder="0"
            />
          </div>

          <div class="modal-footer">
            <button type="button" @click="$emit('close')" class="btn-cancel">
              取消
            </button>
            <button type="submit" :disabled="loading" class="btn-primary">
              {{ loading ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Folder, CreateFolderInput, UpdateFolderInput } from '~/types'

defineOptions({
  inheritAttrs: false
})

interface Props {
  show: boolean
  folder?: Folder
  parentId?: string | null
  parentFolderName?: string
}

const props = withDefaults(defineProps<Props>(), {
  folder: undefined,
  parentId: null,
  parentFolderName: ''
})

const emit = defineEmits<{
  close: []
  saved: []
}>()

const form = reactive<{
  name: string
  type: 'SCENE' | 'GROUP' | 'PROJECT' | 'SUBPROJECT'
  description: string
  icon: string
  color: string
  sortOrder: number
}>({
  name: '',
  type: 'GROUP',
  description: '',
  icon: '',
  color: '',
  sortOrder: 0
})

const loading = ref(false)

watch(
  () => props.folder,
  (f) => {
    if (f) {
      form.name = f.name
      form.type = f.type
      form.description = f.description ?? ''
      form.icon = f.icon ?? ''
      form.color = f.color ?? ''
      form.sortOrder = f.sort_order
    } else {
      form.name = ''
      form.type = 'GROUP'
      form.description = ''
      form.icon = ''
      form.color = ''
      form.sortOrder = 0
    }
  },
  { immediate: true }
)

const handleSubmit = async () => {
  loading.value = true
  try {
    const url = props.folder?.id ? `/api/folders/${props.folder.id}` : '/api/folders'
    const method = props.folder?.id ? 'PATCH' : 'POST'

    const body: CreateFolderInput | UpdateFolderInput = {
      ...form,
      ...(props.folder?.id ? {} : { parentId: props.parentId })
    }

    await $fetch(url, { method, body })

    emit('saved')
    emit('close')
  } catch (e: any) {
    const message = e.data?.message || '保存失败'
    const { error } = useToast()
    error(message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.parent-hint {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
  border-radius: 0.25rem;
}

.close-btn:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-field label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-field input,
.form-field select,
.form-field textarea {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.15s;
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-field textarea {
  resize: vertical;
  min-height: 80px;
}

.color-input-group {
  display: flex;
  gap: 0.5rem;
}

.color-picker {
  width: 50px;
  height: 38px;
  padding: 0.125rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
}

.color-text {
  flex: 1;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-cancel,
.btn-primary {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-cancel {
  background-color: white;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-cancel:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.btn-primary {
  background-color: #3b82f6;
  border: none;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
