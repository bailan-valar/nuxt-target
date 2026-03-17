<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <!-- 头部 -->
          <div class="modal-header">
            <h2 class="modal-title">
              {{ isEditing ? '编辑文件夹' : '创建文件夹' }}
            </h2>
            <button
              type="button"
              class="modal-close"
              @click="close"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- 内容 -->
          <div class="modal-body">
            <FolderEdit
              :folder="folder"
              :available-parents="availableParents"
              @submit="handleSubmit"
              @cancel="close"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Folder, CreateFolderInput, UpdateFolderInput } from '~/types'

interface Props {
  isOpen: boolean
  folder?: Folder
  availableParents?: Folder[]
}

const props = withDefaults(defineProps<Props>(), {
  folder: undefined,
  availableParents: () => []
})

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  submit: [data: CreateFolderInput | UpdateFolderInput]
}>()

const isEditing = computed(() => !!props.folder)

function close() {
  emit('update:isOpen', false)
}

function handleOverlayClick() {
  close()
}

async function handleSubmit(data: CreateFolderInput | UpdateFolderInput) {
  emit('submit', data)
  // 注意：这里不自动关闭对话框，让调用方根据操作结果决定
}

// ESC 键关闭
onKeyStroke('Escape', () => {
  if (props.isOpen) {
    close()
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 1rem;
}

.modal-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.15s;
}

.modal-close:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}
</style>
