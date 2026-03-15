<template>
  <div class="folder-tree">
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <span>加载中...</span>
    </div>

    <div v-else-if="error" class="error-state">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="filteredFolders.length === 0" class="empty-state">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      </svg>
      <p>暂无文件夹</p>
    </div>

    <div v-else class="tree-root">
      <FolderTreeNode
        v-for="folder in filteredFolders"
        :key="folder.id"
        :folder="folder"
        :depth="0"
        :selected-id="selectedId"
        @select="handleSelect"
        @toggle="handleToggle"
        @contextmenu="handleContextMenu"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Folder } from '~/types'

interface Props {
  folderType?: string
  selectedId?: string
}

const props = withDefaults(defineProps<Props>(), {
  folderType: undefined,
  selectedId: ''
})

const emit = defineEmits<{
  select: [folder: Folder]
  contextmenu: [event: MouseEvent, folder: Folder]
}>()

const { data: foldersData, pending, error, refresh } = await useFetch(
  '/api/folders',
  {
    query: {
      type: props.folderType,
      expandAll: true,
      includeGoals: false
    }
  }
)

const isLoading = computed(() => pending.value)

const folders = computed(() => {
  return foldersData.value?.data ?? []
})

const filteredFolders = computed(() => {
  return folders.value
})

// 默认展开所有文件夹
const expandedIds = ref<Set<string>>(new Set())

// 初始化展开所有文件夹
const initializeExpandedIds = (folderList: any[]) => {
  folderList.forEach(folder => {
    expandedIds.value.add(folder.id)
    if (folder.children && folder.children.length > 0) {
      initializeExpandedIds(folder.children)
    }
  })
}

// 监听文件夹数据变化，自动展开所有节点
watch(folders, (newFolders) => {
  if (newFolders && newFolders.length > 0) {
    initializeExpandedIds(newFolders)
  }
}, { immediate: true })

provide('expandedIds', expandedIds)

const handleSelect = (folder: Folder) => {
  emit('select', folder)
}

const handleToggle = (folderId: string) => {
  if (expandedIds.value.has(folderId)) {
    expandedIds.value.delete(folderId)
  } else {
    expandedIds.value.add(folderId)
  }
}

const handleContextMenu = (event: MouseEvent, folder: Folder) => {
  emit('contextmenu', event, folder)
}

defineExpose({
  refresh
})
</script>

<style scoped>
.folder-tree {
  width: 100%;
  min-height: 200px;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem 1rem;
  color: #6b7280;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-state svg,
.empty-state svg {
  color: #9ca3af;
}

.tree-root {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>
