<template>
  <div class="folders-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div>
        <h1 class="page-title">文件夹管理</h1>
        <p class="page-description">组织和管理您的文件夹，创建无限层级结构</p>
      </div>
      <button class="btn-primary" @click="handleCreateFolder(null)">
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
        新建文件夹
      </button>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <!-- 类型筛选 -->
        <select v-model="filterType" class="filter-select">
          <option value="">全部类型</option>
          <option value="SCENE">场景</option>
          <option value="GROUP">分组</option>
          <option value="PROJECT">项目</option>
          <option value="SUBPROJECT">子项目</option>
        </select>

        <!-- 视图切换 -->
        <div class="view-toggle">
          <button
            :class="{ active: viewMode === 'tree' }"
            @click="viewMode = 'tree'"
            title="树形视图"
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
              <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
              <line x1="12" y1="11" x2="12" y2="17"></line>
              <line x1="9" y1="14" x2="15" y2="14"></line>
            </svg>
          </button>
          <button
            :class="{ active: viewMode === 'list' }"
            @click="viewMode = 'list'"
            title="列表视图"
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
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
          <button
            :class="{ active: viewMode === 'hierarchy' }"
            @click="viewMode = 'hierarchy'"
            title="层级表格视图"
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
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="3" y1="15" x2="21" y2="15"></line>
              <line x1="9" y1="3" x2="9" y2="21"></line>
              <line x1="15" y1="3" x2="15" y2="21"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="toolbar-right">
        <button class="btn-secondary" @click="folderTreeRef?.refresh()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          刷新
        </button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <!-- 树形视图 -->
      <div v-if="viewMode === 'tree'" class="tree-view">
        <FolderTree
          ref="folderTreeRef"
          :folder_type="filterType || undefined"
          @select="handleSelectFolder"
          @contextmenu="handleContextMenu"
        />
      </div>

      <!-- 列表视图 -->
      <div v-else-if="viewMode === 'list'" class="list-view">
        <FolderList
          :folders="foldersList"
          @edit="handleEditFromList"
          @add-subfolder="handleAddSubfolderFromList"
          @delete="handleDeleteFromList"
        />
      </div>

      <!-- 层级表格视图 -->
      <div v-else-if="viewMode === 'hierarchy'" class="hierarchy-view">
        <FolderHierarchyTable
          :folders="foldersList"
          @edit="handleEditFromList"
          @add-subfolder="handleAddSubfolderFromList"
          @delete="handleDeleteFromList"
          @move="handleMoveFromList"
        />
      </div>
    </div>

    <!-- 文件夹模态框 -->
    <FolderModal
      :show="showModal"
      :folder="selectedFolder"
      :parentId="parentFolderId"
      :parentFolderName="parentFolderName"
      @close="handleCloseModal"
      @saved="handleFolderSaved"
    />

    <!-- 右键菜单 -->
    <FolderContextMenu
      :show="showContextMenu"
      :x="contextMenuPosition.x"
      :y="contextMenuPosition.y"
      @edit="handleEditFolder"
      @add-subfolder="handleAddSubfolder"
      @move="handleMoveFolder"
      @delete="handleDeleteFolder"
      @close="showContextMenu = false"
    />

    <!-- 移动模态框 -->
    <MoveFolderModal
      :show="showMoveModal"
      :folder="selectedFolder"
      @close="showMoveModal = false"
      @moved="handleFolderMoved"
    />

    <!-- Toast容器 -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import type { Folder } from '~/types'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const viewMode = ref<'tree' | 'list' | 'hierarchy'>('tree')
const filterType = ref('')
const selectedFolder = ref<Folder>()
const parentFolderId = ref<string | null>(null)
const parentFolderName = ref<string>('')
const showModal = ref(false)
const showContextMenu = ref(false)
const showMoveModal = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })

const folderTreeRef = ref()

// 获取文件夹列表（用于列表视图）
const { data: foldersData, refresh: refreshFolders } = await useFetch('/api/folders', {
  query: {
    expandAll: true,
    includeGoals: true
  }
})

const foldersList = computed(() => {
  return foldersData.value?.data ?? []
})

// 选择文件夹
const handleSelectFolder = (folder: Folder) => {
  selectedFolder.value = folder
}

// 右键菜单
const handleContextMenu = (event: MouseEvent, folder: Folder) => {
  selectedFolder.value = folder
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
  showContextMenu.value = true
}

// 创建文件夹
const handleCreateFolder = async (parentId: string | null, parentName: string = '') => {
  selectedFolder.value = undefined
  parentFolderId.value = parentId
  parentFolderName.value = parentName
  // 等待 DOM 更新，确保 selectedFolder 已清除
  await nextTick()
  showModal.value = true
}

// 添加子文件夹
const handleAddSubfolder = async () => {
  showContextMenu.value = false
  const parent = selectedFolder.value
  parentFolderId.value = parent?.id || null
  parentFolderName.value = parent?.name || ''
  selectedFolder.value = undefined
  // 等待 DOM 更新，确保 selectedFolder 已清除
  await nextTick()
  showModal.value = true
}

// 编辑文件夹
const handleEditFolder = () => {
  showContextMenu.value = false
  showModal.value = true
}

// 移动文件夹
const handleMoveFolder = () => {
  showContextMenu.value = false
  showMoveModal.value = true
}

// 删除文件夹
const handleDeleteFolder = async () => {
  showContextMenu.value = false

  if (!selectedFolder.value) return

  const confirmed = confirm(
    `确定要删除文件夹"${selectedFolder.value.name}"吗？\n\n${
      selectedFolder.value._count &&
      (selectedFolder.value._count.children > 0 ||
        selectedFolder.value._count.goals > 0)
        ? '该文件夹包含子内容，请先清空或使用强制删除。'
        : ''
    }`
  )

  if (!confirmed) return

  try {
    const hasChildren =
      selectedFolder.value._count &&
      (selectedFolder.value._count.children > 0 ||
        selectedFolder.value._count.goals > 0)

    await $fetch(`/api/folders/${selectedFolder.value.id}`, {
      method: 'DELETE',
      query: hasChildren ? { force: 'true' } : undefined
    })

    const { success } = useToast()
    success('文件夹已删除')

    refreshFolders()
    folderTreeRef.value?.refresh()
  } catch (e: any) {
    const { error: showError } = useToast()
    showError(e.data?.message || '删除失败')
  }
}

// 文件夹保存成功
const handleFolderSaved = () => {
  showModal.value = false
  selectedFolder.value = undefined
  parentFolderId.value = null
  parentFolderName.value = ''
  refreshFolders()
  folderTreeRef.value?.refresh()
}

// 文件夹移动成功
const handleFolderMoved = () => {
  showMoveModal.value = false
  refreshFolders()
  folderTreeRef.value?.refresh()
}

// 关闭模态框
const handleCloseModal = () => {
  showModal.value = false
  selectedFolder.value = undefined
  parentFolderId.value = null
  parentFolderName.value = ''
}

// 从列表视图编辑
const handleEditFromList = (folder: Folder) => {
  selectedFolder.value = folder
  showModal.value = true
}

// 从列表视图添加子文件夹
const handleAddSubfolderFromList = async (folder: Folder) => {
  parentFolderId.value = folder.id
  parentFolderName.value = folder.name
  selectedFolder.value = undefined
  // 等待 DOM 更新，确保 selectedFolder 已清除
  await nextTick()
  showModal.value = true
}

// 从列表视图删除
const handleDeleteFromList = (folder: Folder) => {
  selectedFolder.value = folder
  handleDeleteFolder()
}

// 从列表视图移动
const handleMoveFromList = (folder: Folder) => {
  selectedFolder.value = folder
  handleMoveFolder()
}

// 监听筛选类型变化
watch(filterType, () => {
  folderTreeRef.value?.refresh()
})
</script>

<style scoped>
.folders-page {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8;
}

.page-header {
  @apply flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6;
}

.page-title {
  @apply text-2xl font-bold text-gray-900;
}

.page-description {
  @apply text-sm text-gray-600 mt-1;
}

.btn-primary,
.btn-secondary {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.btn-secondary {
  @apply bg-white text-gray-700 border border-gray-300 hover:bg-gray-50;
}

.toolbar {
  @apply flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 p-4 bg-white rounded-lg border border-gray-200;
}

.toolbar-left {
  @apply flex items-center gap-3;
}

.filter-select {
  @apply px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.view-toggle {
  @apply inline-flex items-center border border-gray-300 rounded-lg overflow-hidden;
}

.view-toggle button {
  @apply p-2 transition-colors;
}

.view-toggle button:first-child {
  @apply border-r border-gray-300;
}

.view-toggle button.active {
  @apply bg-blue-50 text-blue-600;
}

.view-toggle button:not(.active):hover {
  @apply bg-gray-50;
}

.toolbar-right {
  @apply flex items-center gap-2;
}

.content {
  @apply bg-white rounded-lg border border-gray-200 min-h-[500px];
}

.tree-view,
.list-view,
.hierarchy-view {
  @apply p-4;
}
</style>
