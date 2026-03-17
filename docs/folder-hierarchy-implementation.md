# 文件夹层级管理功能实现总结

## 功能概述

实现了严格按照层级顺序的文件夹管理系统，类型顺序为：
**场景 (SCENE) → 分组 (GROUP) → 项目 (PROJECT) → 子项目 (SUBPROJECT)**

## 核心规则

### 类型层级关系

1. **根级别**：只能创建场景
2. **场景**：只能创建分组
3. **分组**：只能创建项目
4. **项目**：只能创建子项目
5. **子项目**：不能创建子文件夹

### 父子关系验证

- 子文件夹类型必须与父文件夹类型匹配
- 移动文件夹时必须保持层级关系
- 修改类型时必须符合当前父文件夹的层级要求

## 实现的组件

### 1. FolderEdit.vue
**路径**: `components/FolderEdit.vue`

**功能**:
- 文件夹创建/编辑表单
- 根据父文件夹类型自动限制可选的子类型
- 智能类型提示和验证
- 支持所有属性编辑

**核心逻辑**:
```typescript
// 根据父文件夹类型获取可用的子类型
getAvailableChildTypes(parentType: FolderType | null): FolderType[]

// 获取当前类型允许的父类型
getAllowedParentTypes(currentType: FolderType): FolderType[]
```

### 2. FolderEditDialog.vue
**路径**: `components/FolderEditDialog.vue`

**功能**:
- 模态对话框包装
- ESC 键关闭支持
- 点击遮罩关闭
- 响应式设计

### 3. FolderManagementExample.vue
**路径**: `components/FolderManagementExample.vue`

**功能**:
- 完整的文件夹管理界面
- 创建、编辑、删除功能
- 文件夹树展示
- 多选支持
- 级联选择（选中父文件夹自动选中所有子文件夹）

## 后端 API 增强

### POST /api/folders
**文件**: `server/api/folders/index.post.ts`

**新增验证**:
```typescript
// 类型层级验证
const availableTypes = getAvailableChildTypes(parentFolder.type)
if (!availableTypes.includes(data.type)) {
  throw createError({
    message: `${parentTypeName}下不能创建${childTypeName}`
  })
}

// 根级别验证
if (!data.parentId && data.type !== 'SCENE') {
  throw createError({
    message: '根级别文件夹只能是场景类型'
  })
}
```

### PATCH /api/folders/:id
**文件**: `server/api/folders/[id].patch.ts`

**新增验证**:
- 修改父文件夹时的层级验证
- 修改类型时的层级验证
- 根级别类型验证

## 使用示例

### 基础使用

```vue
<script setup lang="ts">
import FolderEditDialog from '~/components/FolderEditDialog.vue'

const isDialogOpen = ref(false)
const editingFolder = ref<Folder>()
const availableParents = ref<Folder[]>([])

async function handleSubmit(data: CreateFolderInput | UpdateFolderInput) {
  const response = await $fetch(
    editingFolder.value
      ? `/api/folders/${editingFolder.value.id}`
      : '/api/folders',
    {
      method: editingFolder.value ? 'PATCH' : 'POST',
      body: data
    }
  )

  if (response.success) {
    await fetchFolders()
    isDialogOpen.value = false
  }
}
</script>

<template>
  <FolderEditDialog
    v-model:is-open="isDialogOpen"
    :folder="editingFolder"
    :available-parents="availableParents"
    @submit="handleSubmit"
  />
</template>
```

### 完整管理界面

参考 `components/FolderManagementExample.vue` 获取完整示例。

## 核心功能特点

### 1. 智能类型限制

- **自动过滤**: 根据父文件夹类型自动过滤可选的子类型
- **唯一选择**: 如果只有一个可用类型，自动选中并禁用选择
- **友好提示**: 显示类型层级关系的文字提示

### 2. 父文件夹验证

- **类型匹配**: 只显示符合层级要求的父文件夹
- **循环检测**: 防止选择自己或子孙文件夹作为父文件夹
- **权限检查**: 确保用户有权限使用选中的父文件夹

### 3. 前后端双重验证

- **前端验证**: 组件层面限制用户选择，提供即时反馈
- **后端验证**: API 层面强制执行业务规则，防止绕过前端

### 4. 级联操作

- **选择级联**: 选中父文件夹自动选中所有子文件夹
- **移动级联**: 移动父文件夹时所有子文件夹跟随移动
- **删除保护**: 有子文件夹的父文件夹受保护

## 文件结构

```
nuxt-target/
├── components/
│   ├── FolderEdit.vue                    # 编辑表单组件
│   ├── FolderEditDialog.vue              # 编辑对话框
│   ├── FolderManagementExample.vue       # 完整管理示例
│   ├── FolderMultiSelectTreeNode.vue     # 树节点组件
│   └── FolderTreeMultiSelect.vue         # 树选择组件
├── server/api/folders/
│   ├── index.post.ts                     # 创建 API（已增强）
│   └── [id].patch.ts                     # 更新 API（已增强）
├── types/
│   └── index.ts                          # 类型定义
└── docs/
    ├── folder-edit-usage.md              # 使用文档
    └── folder-hierarchy-implementation.md # 实现总结（本文件）
```

## 类型定义

```typescript
// types/index.ts
export type FolderType = 'SCENE' | 'GROUP' | 'PROJECT' | 'SUBPROJECT'

export interface Folder {
  id: string
  userId: string
  parentId: string | null
  name: string
  type: FolderType
  description: string | null
  icon: string | null
  color: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
  parent?: Folder | null
  children?: Folder[]
  goals?: Goal[]
  _count?: {
    children: number
    goals: number
  }
}

export interface CreateFolderInput {
  name: string
  type: FolderType
  description?: string
  icon?: string
  color?: string
  parentId?: string | null
  sortOrder?: number
}

export interface UpdateFolderInput {
  name?: string
  type?: FolderType
  description?: string
  icon?: string
  color?: string
  sortOrder?: number
  parentId?: string | null
}
```

## 错误处理

### 常见错误场景

1. **类型不匹配**
   - 错误: `"场景下不能创建项目，只能创建分组"`
   - 解决: 选择正确的文件夹类型或父文件夹

2. **根级别限制**
   - 错误: `"根级别文件夹只能是场景类型"`
   - 解决: 在创建根文件夹时选择场景类型

3. **循环依赖**
   - 错误: `"不能创建循环依赖关系"`
   - 解决: 不要将文件夹移动到自己的子孙文件夹下

4. **权限问题**
   - 错误: `"无权使用该父文件夹"`
   - 解决: 只能使用自己创建的文件夹作为父文件夹

## 最佳实践

### 1. 组件使用

- **总是提供 availableParents**: 让组件可以正确过滤父文件夹选项
- **使用 Dialog 组件**: 提供更好的用户体验
- **处理错误**: 捕获 API 错误并友好提示

### 2. 数据管理

- **及时刷新**: 操作成功后刷新文件夹列表
- **清理状态**: 对话框关闭时清理编辑状态
- **级联操作**: 利用级联选择简化用户操作

### 3. 用户体验

- **智能提示**: 显示为什么某些选项不可用
- **确认操作**: 删除操作需要用户确认
- **即时反馈**: 操作成功/失败立即提示用户

## 测试建议

### 单元测试

```typescript
// 测试类型层级关系
describe('Folder Type Hierarchy', () => {
  it('should only allow SCENE at root level', () => {
    const result = getAvailableChildTypes(null)
    expect(result).toEqual(['SCENE'])
  })

  it('should only allow GROUP under SCENE', () => {
    const result = getAvailableChildTypes('SCENE')
    expect(result).toEqual(['GROUP'])
  })

  it('should not allow children under SUBPROJECT', () => {
    const result = getAvailableChildTypes('SUBPROJECT')
    expect(result).toEqual([])
  })
})
```

### 集成测试

```typescript
// 测试创建 API
describe('POST /api/folders', () => {
  it('should create SCENE at root level', async () => {
    const response = await POST('/api/folders', {
      name: '测试场景',
      type: 'SCENE',
      parentId: null
    })
    expect(response.success).toBe(true)
  })

  it('should reject non-SCENE at root level', async () => {
    const response = await POST('/api/folders', {
      name: '测试分组',
      type: 'GROUP',
      parentId: null
    })
    expect(response.success).toBe(false)
  })
})
```

## 扩展建议

### 1. 批量操作

- 批量移动文件夹
- 批量修改属性
- 批量删除

### 2. 拖拽功能

- 拖拽移动文件夹
- 拖拽调整排序
- 拖拽到父文件夹下

### 3. 快捷操作

- 右键菜单
- 键盘快捷键
- 快速创建子文件夹

### 4. 视图增强

- 折叠/展开全部
- 搜索过滤
- 面包屑导航

## 注意事项

1. **数据一致性**: 确保前后端验证逻辑一致
2. **性能优化**: 大量文件夹时考虑虚拟滚动
3. **权限控制**: 确保用户只能操作自己的文件夹
4. **错误提示**: 提供清晰友好的错误信息

## 相关文档

- [使用说明](./folder-edit-usage.md)
- [API 文档](../server/api/folders/)
- [类型定义](../types/index.ts)

## 总结

本次实现提供了完整的文件夹层级管理功能，包括：

✅ 严格的类型层级验证
✅ 智能的前端组件
✅ 完善的后端 API
✅ 友好的用户体验
✅ 完整的错误处理

系统确保了文件夹结构的完整性和一致性，防止了不合理的层级关系。
