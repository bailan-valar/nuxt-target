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
      </div>

      <div class="toolbar-right">
        <button class="btn-secondary" @click="refreshFolders">
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
      <!-- 列表视图 -->
      <div class="list-view">
        <FolderList
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

const filterType = ref('')
const selectedFolder = ref<Folder>()
const parentFolderId = ref<string | null>(null)
const parentFolderName = ref<string>('')
const showModal = ref(false)
const showMoveModal = ref(false)

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

// 创建文件夹
const handleCreateFolder = async (parentId: string | null, parentName: string = '') => {
  selectedFolder.value = undefined
  parentFolderId.value = parentId
  parentFolderName.value = parentName
  // 等待 DOM 更新，确保 selectedFolder 已清除
  await nextTick()
  showModal.value = true
}

// 移动文件夹
const handleMoveFolder = () => {
  showMoveModal.value = true
}

// 删除文件夹
const handleDeleteFolder = async () => {
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
}

// 文件夹移动成功
const handleFolderMoved = () => {
  showMoveModal.value = false
  refreshFolders()
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

.toolbar-right {
  @apply flex items-center gap-2;
}

.content {
  @apply bg-white rounded-lg border border-gray-200 min-h-[500px];
}

.list-view {
  @apply p-4;
}
</style>
