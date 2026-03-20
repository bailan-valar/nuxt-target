# GoalEditDrawer 组件使用说明

## 概述

`GoalEditDrawer` 是一个仿 Notion 风格的目标编辑抽屉组件，具有以下特点：

- ✨ 无边框富文本编辑器（基于 Tiptap）
- 🎨 图标选择器
- 📊 右侧属性面板
- 💾 自动保存功能
- 🔔 实时保存状态提示
- 📱 响应式设计

## 基础用法

```vue
<template>
  <div>
    <button @click="openDrawer">新建目标</button>

    <GoalEditDrawer
      :show="showDrawer"
      :goal="selectedGoal"
      @close="showDrawer = false"
      @saved="onSaved"
      @deleted="onDeleted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GoalEditDrawer from '~/components/GoalEditDrawer.vue'

const showDrawer = ref(false)
const selectedGoal = ref<Goal | undefined>(undefined)

const openDrawer = () => {
  showDrawer.value = true
}

const onSaved = () => {
  console.log('目标已保存')
}

const onDeleted = () => {
  console.log('目标已删除')
}
</script>
```

## Props

### `show`

- **类型**: `boolean`
- **必填**: 是
- **说明**: 控制抽屉的显示/隐藏状态

### `goal`

- **类型**: `Goal | undefined`
- **必填**: 否
- **说明**: 要编辑的目标对象，如果不提供则创建新目标

```typescript
interface Goal {
  id: string
  title: string
  description: string | null
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'PENDING_VERIFICATION' | 'COMPLETED' | 'ABANDONED'
  periodType: 'YEAR' | 'MONTH' | 'WEEK' | 'TASK' | 'CUSTOM' | null
  periodValue: string | null
  plannedStart: string | null
  plannedEnd: string | null
  nextExecution: string | null
  parent?: Goal | null
  children?: Goal[]
  icon?: string | null
  folderId?: string | null
}
```

### `defaults`

- **类型**: `object | null`
- **必填**: 否
- **说明**: 新建目标时的默认值

```typescript
{
  folderId: string | null
  periodType: string
  periodValue: string
  parentGoal?: Goal | null
}
```

## Events

### `@close`

抽屉关闭时触发

### `@saved`

目标保存成功时触发

### `@deleted`

目标删除成功时触发

## 功能特性

### 1. 无边框富文本编辑器

使用基于 Tiptap 的 NotionEditor 组件，支持：

- 粗体、斜体、删除线
- 标题（H1-H3）
- 列表（有序、无序、待办）
- 引用、代码块
- 链接插入和编辑
- 斜杠命令（/）

### 2. 自动保存

编辑内容时自动触发保存，默认延迟 1 秒：

```typescript
// 自动保存逻辑
scheduleAutoSave() // 输入后 1 秒自动保存
```

### 3. 属性编辑

右侧属性面板支持编辑：

- **状态**: 待开始、进行中、待验证、已完成、已放弃
- **项目**: 选择所属文件夹
- **父目标**: 选择父级目标
- **周期**: YEAR、MONTH、WEEK、TASK、CUSTOM
- **计划时间**: 开始时间、结束时间
- **下次执行**: 周期性任务的下次执行时间

### 4. 图标选择

内置常用目标图标：

🎯 📋 📝 ✅ ⭐ 🔥 💡 🚀 🎨 🎵 📚 💻 🏃 🧘 💪 🎉

## 样式定制

组件使用 Tailwind CSS，可以通过修改类名来定制样式：

```vue
<style scoped>
/* 修改抽屉宽度 */
:deep(.goal-drawer) {
  max-width: 1200px;
}

/* 修改编辑器区域 */
:deep(.editor-container) {
  max-width: 800px;
}

/* 修改属性面板 */
:deep(.properties-panel) {
  width: 360px;
}
</style>
```

## 响应式设计

- 桌面端：左右分栏布局，编辑器 + 属性面板
- 移动端：隐藏属性面板，只显示编辑器

## 依赖组件

- `NotionEditor`: 富文本编辑器
- `FolderSelector`: 文件夹选择器
- `ParentGoalSelector`: 父目标选择器
- `PeriodSelector`: 周期选择器

## API 依赖

需要以下 API 端点：

- `GET /api/folders` - 获取文件夹列表
- `POST /api/goals` - 创建目标
- `PATCH /api/goals/:id` - 更新目标
- `DELETE /api/goals/:id` - 删除目标

## 示例页面

查看演示页面：`/goal-drawer-demo`

## 注意事项

1. 确保所有依赖组件已正确导入
2. API 端点需要正确配置
3. 自动保存功能需要 API 支持幂等性
4. 删除操作有二次确认对话框
