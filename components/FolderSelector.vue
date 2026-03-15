<template>
  <div class="folder-selector">
    <label v-if="label" class="selector-label">{{ label }}</label>
    <div class="selector-container">
      <select
        :id="id"
        :value="modelValue"
        class="selector-select"
        @change="handleChange"
      >
        <option value="">无文件夹</option>
        <optgroup
          v-for="group in folderTree"
          :key="group.id"
          :label="group.name"
        >
          <option
            v-for="folder in flattenFolderTree(group)"
            :key="folder.id"
            :value="folder.id"
            :disabled="excludeFolderId === folder.id"
          >
            {{ folder.indent }}{{ folder.name }}
          </option>
        </optgroup>
      </select>

      <button
        v-if="allowCreate"
        type="button"
        class="create-btn"
        @click="showCreateModal = true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>

    <FolderModal
      :show="showCreateModal"
      @close="showCreateModal = false"
      @saved="handleFolderCreated"
    />
  </div>
</template>

<script setup lang="ts">
import type { Folder } from '~/types'

interface Props {
  id?: string
  label?: string
  modelValue?: string | null
  excludeFolderId?: string
  allowCreate?: boolean
  folderType?: string
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  label: '',
  modelValue: null,
  excludeFolderId: '',
  allowCreate: false,
  folderType: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const showCreateModal = ref(false)

const { data: foldersData, refresh } = await useFetch('/api/folders', {
  query: {
    type: props.folderType,
    expandAll: true
  }
})

const folderTree = computed(() => {
  return foldersData.value?.data ?? []
})

function flattenFolderTree(
  folder: Folder,
  depth: number = 0
): Array<Folder & { indent: string }> {
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

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value || null)
}

function handleFolderCreated() {
  refresh()
}
</script>

<style scoped>
.folder-selector {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.selector-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.selector-container {
  display: flex;
  gap: 0.5rem;
}

.selector-select {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.15s;
}

.selector-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.create-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.15s;
}

.create-btn:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
  color: #374151;
}

.create-btn:active {
  background-color: #f3f4f6;
}
</style>
