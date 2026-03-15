<template>
  <div class="folder-node" :style="{ paddingLeft: `${depth * 20}px` }">
    <div
      class="folder-content"
      :class="{
        'selected': isSelected,
        'is-scene': folder.type === 'SCENE',
        'is-group': folder.type === 'GROUP',
        'is-project': folder.type === 'PROJECT',
        'is-subproject': folder.type === 'SUBPROJECT'
      }"
      @click="handleClick"
      @contextmenu.prevent="handleContextMenu"
    >
      <!-- 展开/折叠按钮 -->
      <button
        v-if="hasChildren"
        class="toggle-btn"
        @click.stop="handleToggle"
      >
        <svg
          v-if="!isOpen"
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

      <!-- 图标 -->
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

      <!-- 名称 -->
      <span class="folder-name">{{ folder.name }}</span>

      <!-- 统计信息 -->
      <span class="folder-count">
        <template v-if="folder._count">
          <span v-if="folder._count.goals > 0" class="goals-count">
            {{ folder._count.goals }}
          </span>
          <span v-if="folder._count.children > 0" class="children-count">
            {{ folder._count.children }}
          </span>
        </template>
      </span>
    </div>

    <!-- 子节点 -->
    <div v-if="hasChildren && isOpen" class="folder-children">
      <FolderTreeNode
        v-for="child in folder.children"
        :key="child.id"
        :folder="child"
        :depth="depth + 1"
        :selected-id="selectedId"
        :is-open="expandedIds.has(child.id)"
        @select="$emit('select', $event)"
        @toggle="$emit('toggle', $event)"
        @contextmenu="$emit('contextmenu', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Folder } from '~/types'

interface Props {
  folder: Folder
  depth: number
  selectedId?: string
  isOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectedId: '',
  isOpen: false
})

const emit = defineEmits<{
  select: [folder: Folder]
  toggle: [folderId: string]
  contextmenu: [event: MouseEvent, folder: Folder]
}>()

const expandedIds = inject<Set<string>>('expandedIds', new Set())

const hasChildren = computed(() => {
  return props.folder.children && props.folder.children.length > 0
})

const isSelected = computed(() => {
  return props.selectedId === props.folder.id
})

const handleClick = () => {
  emit('select', props.folder)
}

const handleToggle = () => {
  emit('toggle', props.folder.id)
}

const handleContextMenu = (event: MouseEvent) => {
  emit('contextmenu', event, props.folder)
}
</script>

<style scoped>
.folder-node {
  user-select: none;
}

.folder-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: background-color 0.15s;
}

.folder-content:hover {
  background-color: #f3f4f6;
}

.folder-content.selected {
  background-color: #dbeafe;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
}

.toggle-btn:hover {
  color: #374151;
}

.folder-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.folder-name {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.folder-count {
  display: flex;
  gap: 0.25rem;
  font-size: 0.75rem;
}

.goals-count,
.children-count {
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  font-weight: 500;
}

.goals-count {
  background-color: #dbeafe;
  color: #1e40af;
}

.children-count {
  background-color: #f3f4f6;
  color: #4b5563;
}

.is-scene .folder-name {
  color: #7c3aed;
}

.is-group .folder-name {
  color: #059669;
}

.is-project .folder-name {
  color: #d97706;
}

.is-subproject .folder-name {
  color: #0891b2;
}

.folder-children {
  margin-top: 0.25rem;
}
</style>
