<template>
  <div class="folder-management">
    <!-- 工具栏 -->
    <div class="toolbar">
      <h2 class="title">文件夹管理</h2>
      <button
        type="button"
        class="btn-primary"
        @click="openCreateDialog"
      >
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        创建文件夹
      </button>
    </div>

    <!-- 文件夹树 -->
    <div class="folder-tree-section">
      <label class="section-label">文件夹结构</label>
      <div class="folder-tree-container">
        <FolderMultiSelectTreeNode
          v-for="folder in folderTree"
          :key="folder.id"
          :folder="folder"
          :depth="0"
          :selected-ids="selectedFolderIds"
          :expanded-ids="expandedFolderIds"
          @toggle="handleFolderToggle"
          @expand="handleFolderExpand"
        />
        <div v-if="folderTree.length === 0" class="empty-state">
          暂无文件夹，点击"创建文件夹"开始创建
        </div>
      </div>
    </div>

    <!-- 选中的文件夹信息 -->
    <div v-if="selectedFolders.length > 0" class="selected-info">
      <h3 class="subtitle">已选择 {{ selectedFolders.length }} 个文件夹</h3>
      <div class="selected-tags">
        <span
          v-for="folder in selectedFolders"
          :key="folder.id"
          :class="['folder-tag', `tag-${folder.type.toLowerCase()}`]"
        >
          {{ folder.name }}
          <button
            type="button"
            class="tag-remove"
            @click="deselectFolder(folder.id)"
          >
            ×
          </button>
        </span>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="actions">
      <button
        v-if="selectedFolderIds.length === 1"
        type="button"
        class="btn-secondary"
        @click="openEditDialog"
      >
        编辑选中文件夹
      </button>
      <button
        v-if="selectedFolderIds.length === 1"
        type="button"
        class="btn-danger"
        @click="handleDelete"
      >
        删除选中文件夹
      </button>
    </div>

    <!-- 编辑对话框 -->
    <FolderEditDialog
      v-model:is-open="isDialogOpen"
      :folder="editingFolder"
      :available-parents="availableParents"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import type { Folder, CreateFolderInput, UpdateFolderInput } from '~/types'

// 状态
const folderTree = ref<Folder[]>([])
const selectedFolderIds = ref<string[]>([])
const expandedFolderIds = ref<Set<string>>(new Set())
const isDialogOpen = ref(false)
const editingFolder = ref<Folder | undefined>()

// 加载文件夹树
async function fetchFolders() {
  try {
    const response = await $fetch('/api/folders', {
      query: {
        expandAll: true,
        includeGoals: false
      }
    })

    if (response.success) {
      folderTree.value = response.data || []

      // 自动展开所有文件夹
      const expandAll = (folders: Folder[]) => {
        folders.forEach(folder => {
          expandedFolderIds.value.add(folder.id)
          if (folder.children) {
            expandAll(folder.children)
          }
        })
      }
      expandAll(folderTree.value)
    }
  } catch (error) {
    console.error('加载文件夹失败:', error)
  }
}

// 获取所有文件夹的扁平映射
const folderMap = computed(() => {
  const map = new Map<string, Folder>()
  const traverse = (folders: Folder[]) => {
    folders.forEach(folder => {
      map.set(folder.id, folder)
      if (folder.children) {
        traverse(folder.children)
      }
    })
  }
  traverse(folderTree.value)
  return map
})

// 选中的文件夹对象（过滤掉被父文件夹包含的子文件夹）
const selectedFolders = computed(() => {
  const hasSelectedAncestor = (folderId: string): boolean => {
    const folder = folderMap.value.get(folderId)
    if (!folder || !folder.parentId) return false

    if (selectedFolderIds.value.includes(folder.parentId)) {
      return true
    }

    return hasSelectedAncestor(folder.parentId)
  }

  return selectedFolderIds.value
    .filter(id => !hasSelectedAncestor(id))
    .map(id => folderMap.value.get(id))
    .filter((f): f is Folder => f !== undefined)
})

// 获取可用的父文件夹
const availableParents = computed(() => {
  if (!editingFolder.value) {
    return folderTree.value
  }

  // 排除自己及其所有子孙文件夹
  const excludeIds = new Set([editingFolder.value.id])
  const collectDescendantIds = (folder: Folder) => {
    if (folder.children) {
      folder.children.forEach(child => {
        excludeIds.add(child.id)
        collectDescendantIds(child)
      })
    }
  }
  collectDescendantIds(editingFolder.value)

  const filterFolders = (folders: Folder[]): Folder[] => {
    return folders
      .filter(f => !excludeIds.has(f.id))
      .map(f => ({
        ...f,
        children: f.children ? filterFolders(f.children) : undefined
      }))
  }

  return filterFolders(folderTree.value)
})

// 文件夹选择处理
function handleFolderToggle(folderId: string) {
  const index = selectedFolderIds.value.indexOf(folderId)
  const isSelecting = index === -1

  const getAllDescendantIds = (folder: Folder): string[] => {
    const ids: string[] = []
    if (folder.children) {
      for (const child of folder.children) {
        ids.push(child.id)
        ids.push(...getAllDescendantIds(child))
      }
    }
    return ids
  }

  const folder = folderMap.value.get(folderId)
  const descendantIds = folder ? getAllDescendantIds(folder) : []

  if (isSelecting) {
    const allIdsToAdd = [folderId, ...descendantIds]
    selectedFolderIds.value = [...new Set([...selectedFolderIds.value, ...allIdsToAdd])]
  } else {
    const allIdsToRemove = new Set([folderId, ...descendantIds])
    selectedFolderIds.value = selectedFolderIds.value.filter(id => !allIdsToRemove.has(id))
  }
}

// 文件夹展开/收起
function handleFolderExpand(folderId: string) {
  if (expandedFolderIds.value.has(folderId)) {
    expandedFolderIds.value.delete(folderId)
  } else {
    expandedFolderIds.value.add(folderId)
  }
}

// 取消选择文件夹
function deselectFolder(folderId: string) {
  selectedFolderIds.value = selectedFolderIds.value.filter(id => id !== folderId)
}

// 打开创建对话框
function openCreateDialog() {
  editingFolder.value = undefined
  isDialogOpen.value = true
}

// 打开编辑对话框
function openEditDialog() {
  if (selectedFolderIds.length !== 1) return

  const folder = folderMap.value.get(selectedFolderIds[0])
  if (folder) {
    editingFolder.value = folder
    isDialogOpen.value = true
  }
}

// 处理表单提交
async function handleSubmit(data: CreateFolderInput | UpdateFolderInput) {
  try {
    let response
    if (editingFolder.value) {
      // 更新
      response = await $fetch(`/api/folders/${editingFolder.value.id}`, {
        method: 'PATCH',
        body: data
      })
    } else {
      // 创建
      response = await $fetch('/api/folders', {
        method: 'POST',
        body: data
      })
    }

    if (response.success) {
      await fetchFolders()
      isDialogOpen.value = false
      editingFolder.value = undefined
    }
  } catch (error: any) {
    const message = error.data?.message || error.message || '操作失败'
    alert(`错误: ${message}`)
  }
}

// 删除文件夹
async function handleDelete() {
  if (selectedFolderIds.length !== 1) return

  const folder = folderMap.value.get(selectedFolderIds[0])
  if (!folder) return

  if (!confirm(`确定要删除文件夹"${folder.name}"吗？`)) {
    return
  }

  try {
    const response = await $fetch(`/api/folders/${folder.id}`, {
      method: 'DELETE'
    })

    if (response.success) {
      await fetchFolders()
      selectedFolderIds.value = []
    }
  } catch (error: any) {
    const message = error.data?.message || error.message || '删除失败'
    alert(`错误: ${message}`)
  }
}

// 初始化
onMounted(() => {
  fetchFolders()
})
</script>

<style scoped>
.folder-management {
  @apply max-w-4xl mx-auto p-6;
}

.toolbar {
  @apply flex items-center justify-between mb-6;
}

.title {
  @apply text-2xl font-bold text-gray-900;
}

.btn-primary {
  @apply flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors;
}

.icon {
  @apply w-5 h-5;
}

.folder-tree-section {
  @apply mb-6;
}

.section-label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}

.folder-tree-container {
  @apply border border-gray-300 rounded-md p-4 bg-white max-h-96 overflow-y-auto;
}

.empty-state {
  @apply text-center text-gray-500 py-8;
}

.selected-info {
  @apply mb-6 p-4 bg-gray-50 rounded-md;
}

.subtitle {
  @apply text-sm font-medium text-gray-700 mb-2;
}

.selected-tags {
  @apply flex flex-wrap gap-2;
}

.folder-tag {
  @apply inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium;
}

.tag-scene {
  @apply bg-blue-100 text-blue-800;
}

.tag-group {
  @apply bg-green-100 text-green-800;
}

.tag-project {
  @apply bg-orange-100 text-orange-800;
}

.tag-subproject {
  @apply bg-purple-100 text-purple-800;
}

.tag-remove {
  @apply ml-1 text-lg leading-none hover:opacity-70;
}

.actions {
  @apply flex gap-3;
}

.btn-secondary {
  @apply px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors;
}

.btn-danger {
  @apply px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors;
}
</style>
