<template>
  <div class="year-folder-cell">
    <div
      v-if="folder"
      class="folder-item"
      :class="{ 'selected': isSelected }"
      :style="{ paddingLeft: `${depth * 20}px` }"
      @click="handleClick"
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
          width="14"
          height="14"
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
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <span v-else class="toggle-spacer"></span>

      <!-- 图标 -->
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
        <span v-else class="text-xs">{{ folder.icon }}</span>
      </div>

      <!-- 名称 -->
      <span class="folder-name">{{ folder.name }}</span>

      <!-- 目标数量 -->
      <span v-if="folder._count?.goals > 0" class="folder-count">
        {{ folder._count.goals }}
      </span>
    </div>
    <span v-else class="text-gray-400 text-xs">-</span>
  </div>
</template>

<script setup lang="ts">
import type { Folder } from '~/types'

interface Props {
  folder: Folder | null
  depth?: number
  selectedId?: string
}

const props = withDefaults(defineProps<Props>(), {
  depth: 0,
  selectedId: ''
})

const emit = defineEmits<{
  select: [folder: Folder]
}>()

const expandedIds = inject<Set<string>>('expandedIds', new Set())

const hasChildren = computed(() => {
  return props.folder?.children && props.folder.children.length > 0
})

const isOpen = computed(() => {
  return props.folder ? expandedIds.value.has(props.folder.id) : false
})

const isSelected = computed(() => {
  return props.selectedId === props.folder?.id
})

const handleClick = () => {
  if (props.folder) {
    emit('select', props.folder)
  }
}

const handleToggle = () => {
  if (props.folder) {
    if (expandedIds.value.has(props.folder.id)) {
      expandedIds.value.delete(props.folder.id)
    } else {
      expandedIds.value.add(props.folder.id)
    }
  }
}
</script>

<style scoped>
.year-folder-cell {
  min-width: 200px;
}

.folder-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.375rem;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: background-color 0.15s;
}

.folder-item:hover {
  background-color: #f3f4f6;
}

.folder-item.selected {
  background-color: #dbeafe;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 18px;
  height: 18px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
  flex-shrink: 0;
}

.toggle-btn:hover {
  color: #374151;
}

.toggle-spacer {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.folder-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.folder-name {
  flex: 1;
  font-size: 0.813rem;
  font-weight: 500;
  color: #1f2937;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.folder-count {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: #dbeafe;
  color: #1e40af;
}
</style>
