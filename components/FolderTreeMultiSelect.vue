<template>
  <div class="folder-tree-multiselect">
    <label v-if="label" class="selector-label">{{ label }}</label>

    <!-- 选中的文件夹显示 -->
    <div class="selected-display" @click="toggleDropdown">
      <div class="selected-tags">
        <span
          v-for="folder in selectedFolders"
          :key="folder.id"
          :class="['folder-tag', `folder-tag-${folder.type.toLowerCase()}`]"
        >
          {{ folder.name }}
          <button
            type="button"
            class="remove-btn"
            @click.stop="removeFolder(folder.id)"
          >
            ×
          </button>
        </span>
        <span v-if="selectedFolders.length === 0" class="placeholder">
          选择文件夹...
        </span>
      </div>
      <button type="button" class="toggle-btn">
        <svg
          :class="{ 'rotate-180': isOpen }"
          class="arrow-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>

    <!-- 下拉树形结构 -->
    <div v-if="isOpen" class="dropdown-tree">
      <div class="tree-actions">
        <button
          type="button"
          class="action-btn"
          @click="selectAll"
        >
          全选
        </button>
        <button
          type="button"
          class="action-btn"
          @click="clearAll"
        >
          清空
        </button>
      </div>

      <div class="tree-content">
        <FolderMultiSelectTreeNode
          v-for="folder in folderTree"
          :key="folder.id"
          :folder="folder"
          :depth="0"
          :selected-ids="selectedIds"
          :expanded-ids="expandedIds"
          :include-goals="props.includeGoals"
          @toggle="handleToggle"
          @expand="handleExpand"
        />
      </div>
    </div>

    <!-- 点击外部关闭 -->
    <div
      v-if="isOpen"
      class="dropdown-backdrop"
      @click="closeDropdown"
    ></div>
  </div>
</template>

<script setup lang="ts">
import type { Folder } from '~/types'

interface Props {
  id?: string
  label?: string
  modelValue?: string[]
  folderType?: string
  includeGoals?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  label: '',
  modelValue: () => [],
  folderType: undefined,
  includeGoals: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const isOpen = ref(false)
const selectedIds = ref<string[]>([...props.modelValue])

// 展开状态管理（默认折叠）
const expandedIds = ref<Set<string>>(new Set())

// 初始化展开指定文件夹（用于需要默认展开某些节点的场景）
const initializeExpandedIds = (folderList: Folder[]) => {
  folderList.forEach(folder => {
    expandedIds.value.add(folder.id)
    if (folder.children) {
      initializeExpandedIds(folder.children)
    }
  })
}

const { data: foldersData } = await useFetch('/api/folders', {
  query: {
    type: props.folderType,
    expandAll: true,
    includeGoals: props.includeGoals
  }
})

const folderTree = computed(() => {
  return foldersData.value?.data ?? []
})

// 默认折叠所有节点
// 如需自动展开，可取消注释以下代码：
// watch(folderTree, (newFolders) => {
//   if (newFolders && newFolders.length > 0) {
//     initializeExpandedIds(newFolders)
//   }
// }, { immediate: true })

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

// 选中的文件夹对象（只显示顶级文件夹，过滤掉被父文件夹包含的子文件夹）
const selectedFolders = computed(() => {
  // 检查一个文件夹是否有被选中的祖先
  const hasSelectedAncestor = (folderId: string): boolean => {
    const folder = folderMap.value.get(folderId)
    if (!folder || !folder.parentId) return false

    // 检查父文件夹是否在选中列表中
    if (selectedIds.value.includes(folder.parentId)) {
      return true
    }

    // 递归检查更上层的祖先
    return hasSelectedAncestor(folder.parentId)
  }

  return selectedIds.value
    .filter(id => !hasSelectedAncestor(id)) // 过滤掉有选中祖先的文件夹
    .map(id => folderMap.value.get(id))
    .filter((f): f is Folder => f !== undefined)
})

// 切换下拉框
function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function closeDropdown() {
  isOpen.value = false
}

// 切换选中状态
function handleToggle(folderId: string) {
  const index = selectedIds.value.indexOf(folderId)
  const isSelecting = index === -1

  // 获取所有子孙文件夹的ID
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

  // 查找文件夹并获取其子孙ID
  const folder = folderMap.value.get(folderId)
  const descendantIds = folder ? getAllDescendantIds(folder) : []

  if (isSelecting) {
    // 选中父文件夹,添加所有子孙文件夹
    const allIdsToAdd = [folderId, ...descendantIds]
    selectedIds.value = [...new Set([...selectedIds.value, ...allIdsToAdd])]
  } else {
    // 取消选中父文件夹,移除所有子孙文件夹
    const allIdsToRemove = new Set([folderId, ...descendantIds])
    selectedIds.value = selectedIds.value.filter(id => !allIdsToRemove.has(id))
  }

  emit('update:modelValue', selectedIds.value)
}

// 切换展开/收起
function handleExpand(folderId: string) {
  if (expandedIds.value.has(folderId)) {
    expandedIds.value.delete(folderId)
  } else {
    expandedIds.value.add(folderId)
  }
}

// 移除文件夹（同时移除所有子孙文件夹）
function removeFolder(folderId: string) {
  // 获取所有子孙文件夹的ID
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

  // 查找文件夹并获取其子孙ID
  const folder = folderMap.value.get(folderId)
  const descendantIds = folder ? getAllDescendantIds(folder) : []

  // 移除父文件夹和所有子孙文件夹
  const allIdsToRemove = new Set([folderId, ...descendantIds])
  selectedIds.value = selectedIds.value.filter(id => !allIdsToRemove.has(id))

  emit('update:modelValue', selectedIds.value)
}

// 全选
function selectAll() {
  const allIds: string[] = []
  const traverse = (folders: Folder[]) => {
    folders.forEach(folder => {
      allIds.push(folder.id)
      if (folder.children) {
        traverse(folder.children)
      }
    })
  }
  traverse(folderTree.value)
  selectedIds.value = allIds
  emit('update:modelValue', selectedIds.value)
}

// 清空
function clearAll() {
  selectedIds.value = []
  emit('update:modelValue', selectedIds.value)
}

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  selectedIds.value = [...newValue]
})
</script>

<style scoped>
.folder-tree-multiselect {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.selector-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.selected-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.15s;
  min-height: 38px;
}

.selected-display:hover {
  border-color: #9ca3af;
}

.selected-tags {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  align-items: center;
}

.folder-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

/* SCENE - 场景 - 蓝色 */
.folder-tag-scene {
  background-color: #dbeafe;
  color: #1e40af;
}

.folder-tag-scene .remove-btn:hover {
  background-color: rgba(30, 64, 175, 0.1);
}

/* GROUP - 分组 - 绿色 */
.folder-tag-group {
  background-color: #dcfce7;
  color: #166534;
}

.folder-tag-group .remove-btn:hover {
  background-color: rgba(22, 101, 52, 0.1);
}

/* PROJECT - 项目 - 橙色 */
.folder-tag-project {
  background-color: #fed7aa;
  color: #9a3412;
}

.folder-tag-project .remove-btn:hover {
  background-color: rgba(154, 52, 18, 0.1);
}

/* SUBPROJECT - 子项目 - 紫色 */
.folder-tag-subproject {
  background-color: #f3e8ff;
  color: #6b21a8;
}

.folder-tag-subproject .remove-btn:hover {
  background-color: rgba(107, 33, 168, 0.1);
}

.remove-btn {
  display: flex;
  align-items: center;
  padding: 0;
  border: none;
  background: none;
  color: inherit;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  border-radius: 0.125rem;
  width: 16px;
  height: 16px;
  justify-content: center;
}

.placeholder {
  color: #9ca3af;
  font-size: 0.875rem;
}

.toggle-btn {
  display: flex;
  align-items: center;
  padding: 0;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
}

.arrow-icon {
  transition: transform 0.2s;
}

.arrow-icon.rotate-180 {
  transform: rotate(180deg);
}

.dropdown-tree {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  margin-top: 0.25rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  display: flex;
  flex-direction: column;
}

.tree-actions {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.action-btn {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #3b82f6;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.15s;
}

.action-btn:hover {
  background-color: #eff6ff;
  border-color: #bfdbfe;
}

.tree-content {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.dropdown-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
}
</style>
