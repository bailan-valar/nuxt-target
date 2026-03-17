<template>
  <div class="folder-list">
    <table class="list-table">
      <thead>
        <tr>
          <th class="drag-handle-column"></th>
          <th>名称</th>
          <th>类型</th>
          <th>描述</th>
          <th>子文件夹</th>
          <th>目标数</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody ref="tableBody">
        <tr
          v-for="(folder, index) in flatFolders"
          :key="folder.id"
          :data-id="folder.id"
          :data-index="index"
          class="draggable-row"
          :class="{ 'collapsed-child': folder.isHidden }"
          @click="handleRowClick"
        >
          <td class="drag-handle-cell" @click.stop @dblclick.stop @mouseup.stop>
            <div class="drag-handle" @mousedown.stop @click.stop @dblclick.stop @mouseup.stop>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="12" r="1"></circle>
                <circle cx="9" cy="5" r="1"></circle>
                <circle cx="9" cy="19" r="1"></circle>
                <circle cx="15" cy="12" r="1"></circle>
                <circle cx="15" cy="5" r="1"></circle>
                <circle cx="15" cy="19" r="1"></circle>
              </svg>
            </div>
          </td>
          <td>
            <div class="folder-name-cell">
              <span v-if="folder.depth > 0" class="indent">{{ '　'.repeat(folder.depth) }}</span>
              <!-- 展开/折叠按钮 -->
              <button
                v-if="folder._count?.children > 0 || folder.children?.length > 0"
                @click.stop="toggleCollapse(folder.id, $event)"
                class="collapse-btn"
                :class="{ collapsed: collapsedFolders.has(folder.id) }"
                :title="collapsedFolders.has(folder.id) ? '展开' : '折叠'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
              <span v-else class="collapse-placeholder"></span>
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
              <button @click.stop="handleAction('edit', folder)" class="action-btn" title="编辑">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button @click.stop="handleAction('add-subfolder', folder)" class="action-btn" title="添加子文件夹">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  <line x1="12" y1="11" x2="12" y2="17"></line>
                  <line x1="9" y1="14" x2="15" y2="14"></line>
                </svg>
              </button>
              <button @click.stop="handleAction('delete', folder)" class="action-btn danger" title="删除">
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
import Sortable from 'sortablejs'

interface Props {
  folders: Folder[]
}

const props = defineProps<Props>()

const emit = defineEmits(['select', 'edit', 'add-subfolder', 'delete', 'move', 'reorder'])

const tableBody = ref<HTMLElement>()
let sortableInstance: Sortable | null = null
const isDragging = ref(false)
const lastDragEndTime = ref(0)

// 折叠状态管理
const collapsedFolders = ref<Set<string>>(new Set())

// 切换折叠状态
const toggleCollapse = (folderId: string, event: Event) => {
  event.stopPropagation()
  if (collapsedFolders.value.has(folderId)) {
    collapsedFolders.value.delete(folderId)
  } else {
    collapsedFolders.value.add(folderId)
  }
  // 触发响应式更新
  collapsedFolders.value = new Set(collapsedFolders.value)
}

// 展开所有
const expandAll = () => {
  collapsedFolders.value = new Set()
}

// 折叠所有
const collapseAll = () => {
  const allFolderIds = new Set<string>()
  const collectFolderIds = (folders: Folder[]) => {
    for (const folder of folders) {
      if (folder.children && folder.children.length > 0) {
        allFolderIds.add(folder.id)
        collectFolderIds(folder.children)
      }
    }
  }
  collectFolderIds(props.folders)
  collapsedFolders.value = allFolderIds
}

// 暴露方法给父组件
defineExpose({
  expandAll,
  collapseAll,
  // 清空折叠状态（用于数据刷新后）
  clearCollapseState: () => {
    collapsedFolders.value = new Set()
  }
})

// 统一处理操作按钮点击
const handleAction = (action: string, folder: Folder, event?: Event) => {
  console.log('[FolderList] handleAction called:', {
    action,
    folderId: folder.id,
    folderName: folder.name,
    isDragging: isDragging.value,
    timeSinceDragEnd: Date.now() - lastDragEndTime.value,
    timestamp: new Date().toISOString()
  })

  if (event) {
    event.stopPropagation()
  }

  // 防止在拖拽结束后立即触发点击
  const now = Date.now()
  if (isDragging.value || now - lastDragEndTime.value < 500) {
    console.log('[FolderList] Action BLOCKED - dragging or too soon after drag')
    return
  }

  console.log('[FolderList] Action ALLOWED, emitting:', action)
  emit(action, folder)
}

// 初始化拖拽排序
onMounted(() => {
  // 添加全局点击监听器用于调试
  const debugClickHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    console.log('[FolderList] Global click detected:', {
      target: target.tagName,
      className: target.className,
      isDragging: isDragging.value,
      timeSinceDragEnd: Date.now() - lastDragEndTime.value
    })
  }

  document.addEventListener('click', debugClickHandler, true)

  if (tableBody.value) {
    sortableInstance = Sortable.create(tableBody.value, {
      animation: 150,
      handle: '.drag-handle',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      delay: 50,
      delayOnTouchOnly: true,
      onStart: (evt) => {
        console.log('[FolderList] ========== Drag started ==========', evt)
        isDragging.value = true
        // 给拖拽的手柄添加特殊类
        const dragHandle = evt.item.querySelector('.drag-handle')
        if (dragHandle) {
          dragHandle.classList.add('is-dragging')
        }
      },
      onEnd: async (evt) => {
        const { oldIndex, newIndex, item } = evt
        console.log('[FolderList] ========== Drag ended ==========', { oldIndex, newIndex })

        // 移除拖拽手柄的类
        const dragHandle = item.querySelector('.drag-handle')
        if (dragHandle) {
          dragHandle.classList.remove('is-dragging')
        }

        if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) {
          console.log('[FolderList] No position change, resetting drag state')
          isDragging.value = false
          return
        }

        // 获取拖拽后的新顺序
        const newOrder = [...flatFolders.value]
        const [movedItem] = newOrder.splice(oldIndex, 1)
        newOrder.splice(newIndex, 0, movedItem)

        console.log('[FolderList] Moved item:', movedItem.name)

        // 计算新的排序值
        const itemsToUpdate = newOrder.map((folder, index) => ({
          id: folder.id,
          sortOrder: index
        }))

        // 发送重新排序事件
        console.log('[FolderList] Emitting reorder event with', itemsToUpdate.length, 'items')
        emit('reorder', itemsToUpdate)

        // 记录拖拽结束时间
        lastDragEndTime.value = Date.now()

        // 延迟重置拖拽状态，防止触发点击事件
        setTimeout(() => {
          console.log('[FolderList] Resetting drag state after 300ms')
          isDragging.value = false
        }, 500)
      }
    })
  }

  // 清理
  onBeforeUnmount(() => {
    document.removeEventListener('click', debugClickHandler, true)
    if (sortableInstance) {
      sortableInstance.destroy()
      sortableInstance = null
    }
  })
})

// 将树形结构扁平化
const flatFolders = computed(() => {
  const flatten = (
    folders: Folder[],
    depth: number = 0,
    parentCollapsed: boolean = false
  ): Array<Folder & { depth: number; isHidden: boolean }> => {
    const result: Array<Folder & { depth: number; isHidden: boolean }> = []

    for (const folder of folders) {
      const isCollapsed = collapsedFolders.value.has(folder.id)
      // 当前文件夹是否隐藏：只有在父级被折叠时才隐藏
      const isHidden = parentCollapsed

      result.push({ ...folder, depth, isHidden })

      if (folder.children && folder.children.length > 0) {
        // 传递给子级的折叠状态：父级被折叠 OR 当前文件夹被折叠
        result.push(...flatten(folder.children, depth + 1, parentCollapsed || isCollapsed))
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

// 处理行点击，防止拖拽时触发其他事件
const handleRowClick = (event: MouseEvent) => {
  console.log('[FolderList] Row clicked:', {
    isDragging: isDragging.value,
    timeSinceDragEnd: Date.now() - lastDragEndTime.value,
    target: (event.target as HTMLElement).tagName,
    targetClass: (event.target as HTMLElement).className
  })

  if (isDragging.value || Date.now() - lastDragEndTime.value < 500) {
    console.log('[FolderList] Row click BLOCKED - dragging or too soon after drag')
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
    return false
  }

  console.log('[FolderList] Row click ALLOWED')
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

.drag-handle-column {
  @apply w-10;
}

.drag-handle-cell {
  @apply cursor-move;
}

.drag-handle {
  @apply flex items-center justify-center text-gray-400 hover:text-gray-600 select-none;
  pointer-events: auto;
  user-select: none;
  cursor: grab;
  position: relative;
  z-index: 10;
}

.drag-handle.is-dragging,
.drag-handle:active {
  cursor: grabbing;
  pointer-events: none;
}

.drag-handle.is-dragging * {
  pointer-events: none;
}

.draggable-row {
  @apply transition-colors;
}

.draggable-row.collapsed-child {
  @apply hidden;
}

.list-table tbody tr.sortable-ghost {
  @apply bg-blue-50 border-blue-200;
}

.list-table tbody tr.sortable-chosen {
  @apply bg-gray-100;
}

.list-table tbody tr.sortable-drag {
  @apply opacity-50;
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

.collapse-btn {
  @apply flex items-center justify-center p-0.5 rounded hover:bg-gray-200 transition-all duration-200 flex-shrink-0;
}

.collapse-btn svg {
  @apply transition-transform duration-200;
}

.collapse-btn.collapsed svg {
  @apply -rotate-90;
}

.collapse-placeholder {
  @apply w-5 flex-shrink-0;
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
