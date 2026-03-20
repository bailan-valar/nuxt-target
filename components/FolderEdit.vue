<template>
  <div class="folder-edit">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- 名称 -->
      <div>
        <label for="folder-name" class="block text-sm font-medium text-gray-700 mb-1">
          名称 *
        </label>
        <input
          id="folder-name"
          v-model="formData.name"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="输入文件夹名称"
        />
      </div>

      <!-- 类型 -->
      <div>
        <label for="folder-type" class="block text-sm font-medium text-gray-700 mb-1">
          类型 *
        </label>
        <select
          id="folder-type"
          v-model="formData.type"
          required
          :disabled="availableTypes.length === 1"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option
            v-for="type in availableTypes"
            :key="type.value"
            :value="type.value"
          >
            {{ type.label }}
          </option>
        </select>
        <p v-if="availableTypes.length === 1" class="mt-1 text-xs text-gray-500">
          {{ typeHint }}
        </p>
      </div>

      <!-- 父文件夹 -->
      <div>
        <label for="folder-parent" class="block text-sm font-medium text-gray-700 mb-1">
          父文件夹
        </label>
        <FolderTreeMultiSelect
          v-if="availableParents.length > 0"
          id="folder-parent"
          v-model="formData.parentId"
          label=""
          :folder-type="allowedParentType"
        />
        <div v-else class="text-sm text-gray-500">
          无可用的父文件夹
        </div>
      </div>

      <!-- 描述 -->
      <div>
        <label for="folder-description" class="block text-sm font-medium text-gray-700 mb-1">
          描述
        </label>
        <textarea
          id="folder-description"
          v-model="formData.description"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="输入文件夹描述（可选）"
        ></textarea>
      </div>

      <!-- 图标 -->
      <div>
        <label for="folder-icon" class="block text-sm font-medium text-gray-700 mb-1">
          图标
        </label>
        <input
          id="folder-icon"
          v-model="formData.icon"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="输入图标（可选）"
        />
      </div>

      <!-- 颜色 -->
      <div>
        <label for="folder-color" class="block text-sm font-medium text-gray-700 mb-1">
          颜色
        </label>
        <div class="flex gap-2">
          <input
            id="folder-color"
          v-model="formData.color"
            type="color"
            class="h-10 w-16 border border-gray-300 rounded-md cursor-pointer"
          />
          <input
            v-model="formData.color"
            type="text"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="选择颜色"
          />
        </div>
      </div>

      <!-- 排序 -->
      <div>
        <label for="folder-sort" class="block text-sm font-medium text-gray-700 mb-1">
          排序顺序
        </label>
        <input
          id="folder-sort"
          v-model.number="formData.sortOrder"
          type="number"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="0"
        />
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          取消
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? '保存中...' : isEditing ? '保存' : '创建' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Folder, FolderType, CreateFolderInput, UpdateFolderInput } from '~/types'

interface Props {
  folder?: Folder
  availableParents?: Folder[]
}

interface FolderTypeOption {
  value: FolderType
  label: string
}

const props = withDefaults(defineProps<Props>(), {
  folder: undefined,
  availableParents: () => []
})

const emit = defineEmits<{
  submit: [data: CreateFolderInput | UpdateFolderInput]
  cancel: []
}>()

// 文件夹类型定义
const FOLDER_TYPES: Record<FolderType, FolderTypeOption> = {
  SCENE: { value: 'SCENE', label: '场景' },
  GROUP: { value: 'GROUP', label: '分组' },
  PROJECT: { value: 'PROJECT', label: '项目' },
  SUBPROJECT: { value: 'SUBPROJECT', label: '子项目' }
}

// 类型层级顺序
const TYPE_HIERARCHY: FolderType[] = ['SCENE', 'GROUP', 'PROJECT', 'SUBPROJECT']

// 获取类型的层级级别
const getTypeLevel = (type: FolderType): number => {
  return TYPE_HIERARCHY.indexOf(type)
}

// 检查是否是编辑模式
const isEditing = computed(() => !!props.folder)

// 表单数据
const formData = ref({
  name: props.folder?.name || '',
  type: props.folder?.type || 'SCENE',
  parentId: props.folder?.parentId || null,
  description: props.folder?.description || '',
  icon: props.folder?.icon || '',
  color: props.folder?.color || '',
  sortOrder: props.folder?.sortOrder || 0
})

// 提交状态
const isSubmitting = ref(false)
const error = ref('')

// 根据父文件夹类型获取可用的子类型
const getAvailableChildTypes = (parentType: FolderType | null): FolderType[] => {
  if (!parentType) {
    // 根级别，只能创建场景
    return ['SCENE']
  }

  // 业务规则：
  // - 场景(SCENE)下可创建：分组(GROUP)、项目(PROJECT)、子项目(SUBPROJECT)，默认为项目
  // - 分组(GROUP)下可创建：项目(PROJECT)、子项目(SUBPROJECT)，默认为项目
  // - 项目(PROJECT)下可创建：子项目(SUBPROJECT)，默认为子项目
  // - 子项目(SUBPROJECT)下不可创建任何文件夹

  switch (parentType) {
    case 'SCENE':
      return ['GROUP', 'PROJECT', 'SUBPROJECT']
    case 'GROUP':
      return ['PROJECT', 'SUBPROJECT']
    case 'PROJECT':
      return ['SUBPROJECT']
    case 'SUBPROJECT':
      return []
    default:
      return []
  }
}

// 根据父文件夹类型获取默认的子类型
const getDefaultChildType = (parentType: FolderType | null): FolderType => {
  if (!parentType) {
    return 'SCENE'
  }

  // 业务规则：场景和分组下默认为项目，项目下默认为子项目
  switch (parentType) {
    case 'SCENE':
    case 'GROUP':
      return 'PROJECT'
    case 'PROJECT':
      return 'SUBPROJECT'
    default:
      return 'SCENE'
  }
}

// 获取当前类型允许的父类型
const getAllowedParentTypes = (currentType: FolderType): FolderType[] => {
  const currentLevel = getTypeLevel(currentType)

  if (currentLevel === 0) {
    // 场景，没有父文件夹
    return []
  }

  // 返回所有上级类型
  return TYPE_HIERARCHY.slice(0, currentLevel)
}

// 可用的类型选项
const availableTypes = computed<FolderTypeOption[]>(() => {
  const parentId = formData.value.parentId

  if (!parentId) {
    // 没有父文件夹，只能创建场景
    return [FOLDER_TYPES.SCENE]
  }

  // 查找父文件夹
  const parent = props.availableParents.find(f => f.id === parentId)
  if (!parent) {
    // 如果找不到父文件夹，默认只能创建场景
    return [FOLDER_TYPES.SCENE]
  }

  // 根据父文件夹类型返回可用的子类型
  const childTypes = getAvailableChildTypes(parent.type)
  return childTypes.map(type => FOLDER_TYPES[type])
})

// 类型提示
const typeHint = computed(() => {
  const parentId = formData.value.parentId

  if (!parentId) {
    return '根级别文件夹只能创建场景'
  }

  const parent = props.availableParents.find(f => f.id === parentId)
  if (!parent) {
    return ''
  }

  const childTypes = getAvailableChildTypes(parent.type as FolderType)
  if (childTypes.length === 0) {
    return `${FOLDER_TYPES[parent.type as FolderType].label}不能创建子文件夹`
  }

  if (childTypes.length === 1) {
    return `${FOLDER_TYPES[parent.type as FolderType].label}下只能创建${FOLDER_TYPES[childTypes[0]].label}`
  }

  // 多个选项时，显示所有选项并用顿号分隔
  const typeLabels = childTypes.map(t => FOLDER_TYPES[t].label).join('、')
  return `${FOLDER_TYPES[parent.type as FolderType].label}下可创建：${typeLabels}`
})

// 允许的父类型
const allowedParentType = computed(() => {
  const currentType = formData.value.type
  const allowedTypes = getAllowedParentTypes(currentType)

  // 返回允许的父类型用于过滤
  return allowedTypes.join(',')
})

// 可用的父文件夹列表
const availableParents = computed(() => {
  const currentType = formData.value.type
  const allowedTypes = getAllowedParentTypes(currentType)

  if (allowedTypes.length === 0) {
    return []
  }

  // 过滤出符合层级要求的父文件夹
  return props.availableParents.filter(folder => {
    // 不能选择自己作为父文件夹（编辑模式）
    if (props.folder && folder.id === props.folder.id) {
      return false
    }

    // 检查类型是否允许
    return allowedTypes.includes(folder.type)
  })
})

// 监听父文件夹变化，自动设置默认类型
watch(() => formData.value.parentId, (newParentId) => {
  // 如果不是编辑模式（新建文件夹），才自动设置默认类型
  if (!isEditing.value) {
    if (newParentId) {
      const parent = props.availableParents.find(f => f.id === newParentId)
      if (parent) {
        const defaultType = getDefaultChildType(parent.type)
        const availableTypes = getAvailableChildTypes(parent.type)
        // 只有当当前类型不在可用类型列表中时，才设置默认类型
        if (!availableTypes.includes(formData.value.type)) {
          formData.value.type = defaultType
        }
      }
    } else {
      // 没有父文件夹，默认为场景
      formData.value.type = 'SCENE'
    }
  }
})

// 监听类型变化，自动调整父文件夹
watch(() => formData.value.type, (newType, oldType) => {
  if (newType === oldType) return

  // 如果切换到场景类型，清空父文件夹
  if (newType === 'SCENE') {
    formData.value.parentId = null
    return
  }

  // 如果当前父文件夹不符合新类型的要求，清空
  if (formData.value.parentId) {
    const parent = props.availableParents.find(f => f.id === formData.value.parentId)
    if (parent) {
      const childTypes = getAvailableChildTypes(parent.type)
      if (!childTypes.includes(newType)) {
        formData.value.parentId = null
      }
    }
  }
})

// 提交表单
async function handleSubmit() {
  error.value = ''

  // 基本验证
  if (!formData.value.name.trim()) {
    error.value = '请输入文件夹名称'
    return
  }

  // 如果选择了父文件夹，验证层级关系
  if (formData.value.parentId) {
    const parent = props.availableParents.find(f => f.id === formData.value.parentId)
    if (!parent) {
      error.value = '父文件夹不存在'
      return
    }

    const childTypes = getAvailableChildTypes(parent.type)
    if (!childTypes.includes(formData.value.type)) {
      error.value = `${FOLDER_TYPES[parent.type].label}下不能创建${FOLDER_TYPES[formData.value.type].label}`
      return
    }
  }

  isSubmitting.value = true

  try {
    const submitData: CreateFolderInput | UpdateFolderInput = {
      name: formData.value.name.trim(),
      type: formData.value.type,
      description: formData.value.description.trim() || undefined,
      icon: formData.value.icon.trim() || undefined,
      color: formData.value.color.trim() || undefined,
      sortOrder: formData.value.sortOrder || 0,
      parentId: formData.value.parentId || undefined
    }

    emit('submit', submitData)
  } catch (err) {
    error.value = err instanceof Error ? err.message : '操作失败，请重试'
  } finally {
    isSubmitting.value = false
  }
}

// 监听父文件夹列表变化，如果当前选中的父文件夹不在列表中，清空选择
watch(() => props.availableParents, (newParents) => {
  if (formData.value.parentId) {
    const exists = newParents.find(f => f.id === formData.value.parentId)
    if (!exists) {
      formData.value.parentId = null
    }
  }
}, { deep: true })
</script>

<style scoped>
.folder-edit {
  @apply w-full;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-4 {
  display: flex;
  flex-direction: column;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 0.75rem;
}

.flex {
  display: flex;
}

.justify-end {
  justify-content: flex-end;
}

.block {
  display: block;
}

.text-sm {
  font-size: 0.875rem;
}

.text-xs {
  font-size: 0.75rem;
}

.font-medium {
  font-weight: 500;
}

.text-gray-700 {
  color: #374151;
}

.text-gray-500 {
  color: #6b7280;
}

.text-red-600 {
  color: #dc2626;
}

.mb-1 {
  margin-bottom: 0.25rem;
}

.mt-1 {
  margin-top: 0.25rem;
}

.pt-4 {
  padding-top: 1rem;
}

.p-3 {
  padding: 0.75rem;
}

.w-full {
  width: 100%;
}

.flex-1 {
  flex: 1;
}

.h-10 {
  height: 2.5rem;
}

.w-16 {
  width: 4rem;
}

.rows-3 {
  rows: 3;
}

.border-t {
  border-top-width: 1px;
  border-top-color: #e5e7eb;
}

.rounded-md {
  border-radius: 0.375rem;
}

.border {
  border-width: 1px;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.border-red-200 {
  border-color: #fecaca;
}

.bg-white {
  background-color: white;
}

.bg-red-50 {
  background-color: #fef2f2;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}

.hover\:bg-gray-100:hover {
  background-color: #f3f4f6;
}

.focus\:outline-none:focus {
  outline: none;
}

.focus\:ring-2:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}

.focus\:ring-offset-2:focus {
  box-shadow: 0 0 0 2px white, 0 0 0 4px rgba(59, 130, 246, 0.5);
}

.focus\:border-transparent:focus {
  border-color: transparent;
}

.disabled\:opacity-50:disabled {
  opacity: 0.5;
}

.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}

.disabled\:bg-gray-100:disabled {
  background-color: #f3f4f6;
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-not-allowed {
  cursor: not-allowed;
}
</style>
