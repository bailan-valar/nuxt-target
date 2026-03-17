# 文件夹编辑组件使用说明

## 概述

文件夹编辑组件严格按照层级顺序管理文件夹类型：
- **场景** (SCENE) → **分组** (GROUP) → **项目** (PROJECT) → **子项目** (SUBPROJECT)

## 组件列表

### 1. FolderEdit.vue

文件夹编辑表单组件，处理文件夹的创建和编辑。

**特性：**
- 根据父文件夹类型自动限制可选的子文件夹类型
- 智能类型验证和提示
- 支持所有文件夹属性编辑（名称、类型、描述、图标、颜色、排序）

**Props:**
```typescript
interface Props {
  folder?: Folder              // 要编辑的文件夹（不传则为创建模式）
  availableParents?: Folder[]  // 可用的父文件夹列表
}
```

**Events:**
```typescript
submit: [data: CreateFolderInput | UpdateFolderInput]  // 提交表单
cancel: []                                              // 取消编辑
```

### 2. FolderEditDialog.vue

文件夹编辑对话框组件，包装了 FolderEdit 并提供模态框界面。

**Props:**
```typescript
interface Props {
  isOpen: boolean              // 对话框是否打开
  folder?: Folder              // 要编辑的文件夹（不传则为创建模式）
  availableParents?: Folder[]  // 可用的父文件夹列表
}
```

**Events:**
```typescript
'update:isOpen': [value: boolean]                      // 更新打开状态
submit: [data: CreateFolderInput | UpdateFolderInput]  // 提交表单
```

## 使用示例

### 示例 1: 创建根级别场景

```vue
<script setup lang="ts">
import { ref } from 'vue'
import FolderEditDialog from '~/components/FolderEditDialog.vue'

const isDialogOpen = ref(false)
const availableParents = ref<Folder[]>([])

async function handleSubmit(data: CreateFolderInput) {
  try {
    const response = await $fetch('/api/folders', {
      method: 'POST',
      body: data
    })

    if (response.success) {
      // 刷新文件夹列表
      await fetchFolders()
      isDialogOpen.value = false
    }
  } catch (error) {
    console.error('创建失败:', error)
  }
}
</script>

<template>
  <button @click="isDialogOpen = true">创建场景</button>

  <FolderEditDialog
    v-model:is-open="isDialogOpen"
    :available-parents="availableParents"
    @submit="handleSubmit"
  />
</template>
```

### 示例 2: 在场景下创建分组

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const selectedSceneId = ref<string>('')  // 选中的场景ID
const allFolders = ref<Folder[]>([])     // 所有文件夹列表

// 只显示场景类型的文件夹作为可选父文件夹
const availableParents = computed(() => {
  return allFolders.value.filter(f => f.type === 'SCENE')
})

const isDialogOpen = ref(false)

function openCreateDialog(sceneId: string) {
  selectedSceneId.value = sceneId
  isDialogOpen.value = true
}

async function handleSubmit(data: CreateFolderInput) {
  // 自动设置父文件夹为选中的场景
  const folderData = {
    ...data,
    parentId: selectedSceneId.value,
    type: 'GROUP'  // 强制设置为分组类型
  }

  const response = await $fetch('/api/folders', {
    method: 'POST',
    body: folderData
  })

  if (response.success) {
    await fetchFolders()
    isDialogOpen.value = false
  }
}
</script>

<template>
  <button @click="openCreateDialog('scene-id')">
    在此场景下创建分组
  </button>

  <FolderEditDialog
    v-model:is-open="isDialogOpen"
    :available-parents="availableParents"
    @submit="handleSubmit"
  />
</template>
```

### 示例 3: 编辑现有文件夹

```vue
<script setup lang="ts">
import { ref } from 'vue'

const editingFolder = ref<Folder | undefined>()
const isDialogOpen = ref(false)
const availableParents = ref<Folder[]>([])

function editFolder(folder: Folder) {
  editingFolder.value = folder
  isDialogOpen.value = true
}

async function handleSubmit(data: UpdateFolderInput) {
  if (!editingFolder.value) return

  const response = await $fetch(`/api/folders/${editingFolder.value.id}`, {
    method: 'PATCH',
    body: data
  })

  if (response.success) {
    await fetchFolders()
    isDialogOpen.value = false
    editingFolder.value = undefined
  }
}
</script>

<template>
  <button @click="editFolder(folder)">编辑</button>

  <FolderEditDialog
    v-model:is-open="isDialogOpen"
    :folder="editingFolder"
    :available-parents="availableParents"
    @submit="handleSubmit"
  />
</template>
```

### 示例 4: 完整的文件夹管理页面

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Folder } from '~/types'

const folders = ref<Folder[]>([])
const isDialogOpen = ref(false)
const editingFolder = ref<Folder | undefined>()

onMounted(async () => {
  await fetchFolders()
})

async function fetchFolders() {
  const response = await $fetch('/api/folders', {
    query: { expandAll: true }
  })
  if (response.success) {
    folders.value = response.data
  }
}

// 获取可用的父文件夹（排除正在编辑的文件夹及其子文件夹）
function getAvailableParents(): Folder[] {
  if (editingFolder.value) {
    // 排除自己及其所有子孙文件夹
    const excludeIds = new Set([editingFolder.value.id])
    const collectDescendantIds = (folder: Folder) => {
      if (folder.children) {
        folder.children.forEach(child => {
          excludeIds.add(child.id)
          collectDescendantIds(child)
        })
      }
    }
    collectDescendantIds(editingFolder.value)

    return folders.value.filter(f => !excludeIds.has(f.id))
  }
  return folders.value
}

function createFolder() {
  editingFolder.value = undefined
  isDialogOpen.value = true
}

function editFolder(folder: Folder) {
  editingFolder.value = folder
  isDialogOpen.value = true
}

async function handleSubmit(data: CreateFolderInput | UpdateFolderInput) {
  try {
    let response
    if (editingFolder.value) {
      // 更新
      response = await $fetch(`/api/folders/${editingFolder.value.id}`, {
        method: 'PATCH',
        body: data
      })
    } else {
      // 创建
      response = await $fetch('/api/folders', {
        method: 'POST',
        body: data
      })
    }

    if (response.success) {
      await fetchFolders()
      isDialogOpen.value = false
      editingFolder.value = undefined
    }
  } catch (error) {
    console.error('操作失败:', error)
  }
}
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">文件夹管理</h1>
      <button
        @click="createFolder"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        创建文件夹
      </button>
    </div>

    <!-- 文件夹树 -->
    <FolderTreeMultiSelect
      v-model="selectedFolderIds"
      label="选择文件夹"
    />

    <!-- 编辑对话框 -->
    <FolderEditDialog
      v-model:is-open="isDialogOpen"
      :folder="editingFolder"
      :available-parents="getAvailableParents()"
      @submit="handleSubmit"
    />
  </div>
</template>
```

## 类型层级规则

### 创建规则

1. **无父文件夹（根级别）**
   - 只能创建：**场景** (SCENE)

2. **场景 (SCENE) 下的子文件夹**
   - 只能创建：**分组** (GROUP)

3. **分组 (GROUP) 下的子文件夹**
   - 只能创建：**项目** (PROJECT)

4. **项目 (PROJECT) 下的子文件夹**
   - 只能创建：**子项目** (SUBPROJECT)

5. **子项目 (SUBPROJECT) 下的子文件夹**
   - 不能创建子文件夹

### 移动规则

- 文件夹只能移动到符合层级关系的父文件夹下
- 例如：分组只能移动到场景下，不能移动到项目下

### 类型变更规则

- 如果修改文件夹类型，必须确保新类型与当前父文件夹的关系符合层级规则
- 例如：场景下的分组不能改为项目（因为场景下只能是分组）

## API 说明

### POST /api/folders

创建新文件夹。

**请求体：**
```typescript
{
  name: string              // 文件夹名称
  type: FolderType          // 文件夹类型
  parentId?: string         // 父文件夹ID（可选）
  description?: string      // 描述（可选）
  icon?: string            // 图标（可选）
  color?: string           // 颜色（可选）
  sortOrder?: number       // 排序顺序（可选）
}
```

**验证规则：**
- 根级别文件夹只能是场景类型
- 子文件夹类型必须符合父文件夹的层级关系

### PATCH /api/folders/:id

更新文件夹。

**请求体：**
```typescript{
  name?: string             // 文件夹名称
  type?: FolderType         // 文件夹类型
  parentId?: string         // 父文件夹ID
  description?: string      // 描述
  icon?: string            // 图标
  color?: string           // 颜色
  sortOrder?: number       // 排序顺序
}
```

**验证规则：**
- 修改父文件夹时，必须确保新层级关系符合规则
- 修改类型时，必须确保与当前父文件夹的关系符合规则
- 不能创建循环依赖

## 后端验证

后端 API 已实现完整的类型层级验证：

1. **创建时验证**
   - 检查父文件夹是否存在
   - 检查父文件夹是否属于当前用户
   - 验证类型层级关系

2. **更新时验证**
   - 检查文件夹是否属于当前用户
   - 验证新父文件夹的层级关系
   - 验证类型变更的层级关系
   - 检查循环依赖

## 错误处理

### 常见错误

1. **400 Bad Request**
   - `"父文件夹不存在"` - 指定的父文件夹ID无效
   - `"根级别文件夹只能是场景类型"` - 尝试在根级别创建非场景类型
   - `"场景下不能创建项目，只能创建分组"` - 类型层级关系错误
   - `"不能创建循环依赖关系"` - 会造成文件夹循环引用

2. **403 Forbidden**
   - `"无权使用该父文件夹"` - 父文件夹不属于当前用户
   - `"无权修改该文件夹"` - 文件夹不属于当前用户

3. **404 Not Found**
   - `"文件夹不存在"` - 指定的文件夹ID无效

## 最佳实践

1. **前端验证**
   - 使用 FolderEdit 组件自动处理类型限制
   - 在提交前验证表单数据

2. **用户体验**
   - 提供清晰的用户提示，说明为什么某些类型不可选
   - 自动过滤不符合条件的父文件夹选项

3. **错误处理**
   - 捕获 API 错误并显示友好的错误消息
   - 在对话框中显示验证错误

4. **数据刷新**
   - 成功操作后刷新文件夹列表
   - 确保用户看到最新的数据

## 注意事项

1. **类型固定性**
   - 文件夹类型一旦创建，建议不要轻易修改
   - 修改类型可能影响所有子文件夹的层级关系

2. **移动限制**
   - 移动文件夹时，所有子文件夹会一起移动
   - 确保移动后的层级关系仍然有效

3. **删除限制**
   - 如果文件夹下有子文件夹或目标，可能需要先处理这些内容
   - 参考数据库的 `onDelete: Restrict` 设置
