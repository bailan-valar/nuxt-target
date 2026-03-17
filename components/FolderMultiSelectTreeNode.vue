<template>
  <div class="tree-node" :style="{ paddingLeft: `${depth * 16}px` }">
    <div class="node-content" @click="handleClick">
      <!-- 展开/收起图标 -->
      <button
        v-if="hasChildren"
        type="button"
        class="expand-btn"
        @click.stop="toggleExpand"
      >
        <svg
          v-if="!isExpanded"
          class="expand-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
        <svg
          v-else
          class="expand-icon"
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
      <div v-else class="expand-placeholder"></div>

      <!-- 复选框 -->
      <input
        type="checkbox"
        :id="`checkbox-${folder.id}`"
        :checked="isChecked"
        class="checkbox"
        @click.stop
        @change="handleCheck"
      />

      <!-- 文件夹图标和名称 -->
      <div
        :for="`checkbox-${folder.id}`"
        class="folder-label"
      >
        <div class="folder-icon" :style="{ color: folder.color || undefined }">
          <svg
            v-if="!folder.icon"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          <span v-else>{{ folder.icon }}</span>
        </div>
        <span class="folder-name">{{ folder.name }}</span>
        <span v-if="folder._count" class="folder-count">
          ({{ folder._count.goals || 0 }})
        </span>
      </div>
    </div>

    <!-- 子节点 -->
    <div v-if="hasChildren && isExpanded" class="children">
      <FolderMultiSelectTreeNode
        v-for="child in folder.children"
        :key="child.id"
        :folder="child"
        :depth="depth + 1"
        :selected-ids="selectedIds"
        :expanded-ids="expandedIds"
        @toggle="$emit('toggle', $event)"
        @expand="$emit('expand', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Folder } from '~/types'

interface Props {
  folder: Folder
  depth: number
  selectedIds: string[]
  expandedIds?: Set<string>
}

const props = withDefaults(defineProps<Props>(), {
  expandedIds: () => new Set<string>()
})

const emit = defineEmits<{
  toggle: [folderId: string]
  expand: [folderId: string]
}>()

// 默认展开当前节点
const isExpanded = computed(() => {
  return props.expandedIds.has(props.folder.id)
})

const hasChildren = computed(() => {
  return props.folder.children && props.folder.children.length > 0
})

const isChecked = computed(() => {
  return props.selectedIds.includes(props.folder.id)
})

function handleClick() {
  if (!hasChildren.value) {
    emit('toggle', props.folder.id)
  } else {
    toggleExpand()
  }
}

function handleCheck() {
  emit('toggle', props.folder.id)
}

function toggleExpand() {
  emit('expand', props.folder.id)
}
</script>

<style scoped>
.tree-node {
  user-select: none;
}

.node-content {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.15s;
}

.node-content:hover {
  background-color: #f3f4f6;
}

.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.125rem;
  transition: all 0.15s;
}

.expand-btn:hover {
  background-color: #e5e7eb;
  color: #374151;
}

.expand-placeholder {
  width: 20px;
  height: 20px;
}

.expand-icon {
  width: 12px;
  height: 12px;
}

.checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  appearance: none;
  position: relative;
  transition: all 0.15s;
}

.checkbox:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.checkbox:checked::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 5px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.folder-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  cursor: pointer;
}

.folder-icon {
  display: flex;
  align-items: center;
  color: #9ca3af;
  flex-shrink: 0;
}

.folder-name {
  font-size: 0.875rem;
  color: #1f2937;
  font-weight: 500;
}

.folder-count {
  font-size: 0.75rem;
  color: #9ca3af;
}

.children {
  display: flex;
  flex-direction: column;
}
</style>
