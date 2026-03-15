<template>
  <div class="folder-list">
    <table class="list-table">
      <thead>
        <tr>
          <th>名称</th>
          <th>类型</th>
          <th>描述</th>
          <th>子文件夹</th>
          <th>目标数</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="folder in flatFolders" :key="folder.id" :style="{ paddingLeft: `${folder.depth * 20}px` }">
          <td>
            <div class="folder-name-cell">
              <span v-if="folder.depth > 0" class="indent">{{ '　'.repeat(folder.depth) }}</span>
              <div class="folder-icon" :style="{ color: folder.color || undefined }">
                <svg
                  v-if="!folder.icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                <span v-else>{{ folder.icon }}</span>
              </div>
              <span class="name">{{ folder.name }}</span>
              <span v-if="folder.type" class="type-badge" :class="`type-${folder.type.toLowerCase()}`">
                {{ getTypeLabel(folder.type) }}
              </span>
            </div>
          </td>
          <td>
            <span class="type-badge" :class="`type-${folder.type.toLowerCase()}`">
              {{ getTypeLabel(folder.type) }}
            </span>
          </td>
          <td>
            <span class="description">{{ folder.description || '-' }}</span>
          </td>
          <td>
            <span class="count">{{ folder._count?.children || 0 }}</span>
          </td>
          <td>
            <span class="count">{{ folder._count?.goals || 0 }}</span>
          </td>
          <td>
            <div class="actions">
              <button @click="$emit('edit', folder)" class="action-btn" title="编辑">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button @click="$emit('add-subfolder', folder)" class="action-btn" title="添加子文件夹">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  <line x1="12" y1="11" x2="12" y2="17"></line>
                  <line x1="9" y1="14" x2="15" y2="14"></line>
                </svg>
              </button>
              <button @click="$emit('delete', folder)" class="action-btn danger" title="删除">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="flatFolders.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      </svg>
      <p>暂无文件夹</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Folder } from '~/types'

interface Props {
  folders: Folder[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [folder: Folder]
  edit: [folder: Folder]
  'add-subfolder': [folder: Folder]
  delete: [folder: Folder]
}>()

// 将树形结构扁平化
const flatFolders = computed(() => {
  const flatten = (folders: Folder[], depth: number = 0): Array<Folder & { depth: number }> => {
    const result: Array<Folder & { depth: number }> = []

    for (const folder of folders) {
      result.push({ ...folder, depth })
      if (folder.children && folder.children.length > 0) {
        result.push(...flatten(folder.children, depth + 1))
      }
    }

    return result
  }

  return flatten(props.folders)
})

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    SCENE: '场景',
    GROUP: '分组',
    PROJECT: '项目',
    SUBPROJECT: '子项目'
  }
  return labels[type] || type
}
</script>

<style scoped>
.folder-list {
  @apply w-full;
}

.list-table {
  @apply w-full border-collapse;
}

.list-table thead {
  @apply bg-gray-50;
}

.list-table th {
  @apply px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.list-table tbody tr {
  @apply border-t border-gray-200 hover:bg-gray-50 transition-colors;
}

.list-table td {
  @apply px-4 py-3;
}

.folder-name-cell {
  @apply flex items-center gap-2;
}

.indent {
  @apply text-gray-300;
}

.folder-icon {
  @apply flex-shrink-0;
}

.folder-icon svg {
  @apply text-gray-400;
}

.name {
  @apply font-medium text-gray-900;
}

.type-badge {
  @apply inline-flex items-center px-2 py-1 rounded-full text-xs font-medium;
}

.type-scene {
  @apply bg-purple-100 text-purple-700;
}

.type-group {
  @apply bg-green-100 text-green-700;
}

.type-project {
  @apply bg-amber-100 text-amber-700;
}

.type-subproject {
  @apply bg-cyan-100 text-cyan-700;
}

.description {
  @apply text-sm text-gray-600 truncate max-w-xs;
}

.count {
  @apply text-sm text-gray-900;
}

.actions {
  @apply flex items-center gap-1;
}

.action-btn {
  @apply p-1.5 rounded hover:bg-gray-200 transition-colors;
}

.action-btn.danger {
  @apply hover:bg-red-100 hover:text-red-600;
}

.empty-state {
  @apply flex flex-col items-center justify-center py-12 text-gray-400;
}

.empty-state svg {
  @apply mb-4;
}

.empty-state p {
  @apply text-sm;
}
</style>
