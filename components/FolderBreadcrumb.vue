<template>
  <nav class="breadcrumb" aria-label="面包屑导航">
    <ol class="breadcrumb-list">
      <li class="breadcrumb-item">
        <button class="breadcrumb-link" @click="$emit('navigate', null)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>首页</span>
        </button>
      </li>

      <li
        v-for="(folder, index) in breadcrumbs"
        :key="folder.id"
        class="breadcrumb-item"
      >
        <svg
          class="breadcrumb-separator"
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

        <button
          v-if="index !== breadcrumbs.length - 1"
          class="breadcrumb-link"
          @click="$emit('navigate', folder.id)"
        >
          {{ folder.name }}
        </button>

        <span v-else class="breadcrumb-current">
          {{ folder.name }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import type { Folder } from '~/types'

interface Props {
  folders: Folder[]
  currentFolderId?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  currentFolderId: null
})

const emit = defineEmits<{
  navigate: [folderId: string | null]
}>()

const breadcrumbs = computed(() => {
  if (!props.currentFolderId) return []

  const buildBreadcrumbPath = (
    folderId: string,
    path: Folder[] = []
  ): Folder[] => {
    const folder = props.folders.find((f) => f.id === folderId)
    if (!folder) return path

    const newPath = [folder, ...path]

    if (folder.parent_id) {
      return buildBreadcrumbPath(folder.parent_id, newPath)
    }

    return newPath
  }

  return buildBreadcrumbPath(props.currentFolderId)
})
</script>

<style scoped>
.breadcrumb {
  padding: 0.75rem 1rem;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.5rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.875rem;
  color: #6b7280;
  border-radius: 0.25rem;
  transition: all 0.15s;
}

.breadcrumb-link:hover {
  background-color: #f3f4f6;
  color: #3b82f6;
}

.breadcrumb-current {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
}

.breadcrumb-separator {
  flex-shrink: 0;
  color: #9ca3af;
}

@media (max-width: 640px) {
  .breadcrumb {
    padding: 0.5rem;
  }

  .breadcrumb-link,
  .breadcrumb-current {
    font-size: 0.8125rem;
  }
}
</style>
