<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-container">
        <div class="modal-header">
          <h2>移动文件夹</h2>
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

        <div class="modal-body">
          <div v-if="folder" class="current-folder">
            <span class="label">当前文件夹：</span>
            <span class="folder-name">{{ folder.name }}</span>
          </div>

          <div class="form-field">
            <label for="parent-folder">目标父文件夹</label>
            <select
              id="parent-folder"
              v-model="selectedParentId"
              class="folder-select"
            >
              <option value="">根目录（无父文件夹）</option>
              <optgroup
                v-for="group in folderTree"
                :key="group.id"
                :label="group.name"
              >
                <option
                  v-for="item in flattenFolderTree(group)"
                  :key="item.id"
                  :value="item.id"
                  :disabled="item.id === folder?.id || isDescendant(item.id)"
                >
                  {{ item.indent }}{{ item.name }}
                  {{ item.id === folder?.id ? '(当前)' : '' }}
                  {{ isDescendant(item.id) ? '(子文件夹)' : '' }}
                </option>
              </optgroup>
            </select>
          </div>

          <div class="form-field">
            <label for="sort-order">排序</label>
            <input
              id="sort-order"
              v-model.number="sortOrder"
              type="number"
              min="0"
              class="sort-input"
              placeholder="0"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" @click="$emit('close')" class="btn-cancel">
            取消
          </button>
          <button type="button" @click="handleMove" :disabled="loading" class="btn-primary">
            {{ loading ? '移动中...' : '移动' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Folder } from '~/types'

interface Props {
  show: boolean
  folder?: Folder
}

const props = withDefaults(defineProps<Props>(), {
  folder: undefined
})

const emit = defineEmits<{
  close: []
  moved: []
}>()

const selectedParentId = ref<string>('')
const sortOrder = ref<number>(0)
const loading = ref(false)

// 获取文件夹树
const { data: foldersData } = await useFetch('/api/folders', {
  query: {
    expandAll: true
  }
})

const folderTree = computed(() => {
  return foldersData.value?.data ?? []
})

// 检查是否是子孙文件夹
const isDescendant = (folderId: string): boolean => {
  if (!props.folder) return false

  const check = (folders: Folder[]): boolean => {
    for (const f of folders) {
      if (f.id === props.folder?.id) {
        // 找到当前文件夹，检查其子文件夹
        if (f.children) {
          for (const child of f.children) {
            if (child.id === folderId) return true
            if (child.children && check(child.children)) return true
          }
        }
        return false
      }
      if (f.children && check(f.children)) return true
    }
    return false
  }

  return check(folderTree.value)
}

// 扁平化文件夹树用于显示
const flattenFolderTree = (
  folder: Folder,
  depth: number = 0
): Array<Folder & { indent: string }> => {
  const items: Array<Folder & { indent: string }> = [
    {
      ...folder,
      indent: '　'.repeat(depth)
    }
  ]

  if (folder.children) {
    for (const child of folder.children) {
      items.push(...flattenFolderTree(child, depth + 1))
    }
  }

  return items
}

// 移动文件夹
const handleMove = async () => {
  if (!props.folder) return

  loading.value = true
  try {
    await $fetch(`/api/folders/${props.folder.id}/move`, {
      method: 'POST',
      body: {
        newParentId: selectedParentId.value || null,
        newSortOrder: sortOrder.value
      }
    })

    const { success } = useToast()
    success('文件夹已移动')

    emit('moved')
    emit('close')
  } catch (e: any) {
    const { error } = useToast()
    error(e.data?.message || '移动失败')
  } finally {
    loading.value = false
  }
}

// 重置表单
watch(() => props.show, (show) => {
  if (show) {
    selectedParentId.value = props.folder?.parentId || ''
    sortOrder.value = props.folder?.sortOrder || 0
  }
})
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

.current-folder {
  @apply mb-4 p-3 bg-gray-50 rounded-lg;
}

.label {
  @apply text-sm font-medium text-gray-700;
}

.folder-name {
  @apply ml-2 font-semibold text-gray-900;
}

.form-field {
  @apply mb-4;
}

.form-field label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}

.folder-select,
.sort-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.folder-select:disabled,
.sort-input:disabled {
  @apply bg-gray-100 cursor-not-allowed;
}

.folder-select option:disabled {
  @apply text-gray-400;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
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
</style>
