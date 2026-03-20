<template>
  <div class="day-view-list">
    <div ref="sortableContainer" class="space-y-2">
      <div v-for="goal in sortedGoals" :key="goal.id" :data-id="goal.id" :class="[
        'day-view-item cursor-pointer rounded-lg px-4 py-3 transition-all',
        goal.status === 'COMPLETED' ? 'bg-gray-50 opacity-60' : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm',
        isDragging ? 'opacity-50' : ''
      ]" @click="handleGoalClick(goal)" @contextmenu.prevent="handleContextMenu($event, goal)">
        <div class="flex items-start gap-3">
          <!-- 拖拽手柄 -->
          <div class="drag-handle cursor-grab active:cursor-grabbing flex items-center justify-center mt-1">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
            </svg>
          </div>

          <!-- 目标信息 -->
          <div class="flex-1 min-w-0">

            <!-- 周期标签 -->
            <div class="flex items-center gap-2 mt-1.5">
              <span :class="[
                'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                getPeriodTypeClass(goal.periodType)
              ]">
                {{ getPeriodTypeLabel(goal.periodType) }}
              </span>
              <div :class="[
                'text-sm font-medium',
                goal.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-gray-900'
              ]">
                {{ goal.title }}
              </div>
            </div>
            <div class="flex items-center gap-2 mt-1.5">
              <span v-if="goal.periodValue" class="text-xs text-gray-500">
                {{ getPeriodValueDisplay(goal.periodType, goal.periodValue) }}
              </span>

              <!-- 显示所属文件夹 -->
              <div v-if="goal.folder" class="text-xs text-gray-500">
                {{ getFolderPath(goal.folder) }}
              </div>

              <!-- 显示父目标 -->
              <div v-if="goal.parent" class="text-xs text-blue-600">
                父目标: {{ goal.parent.title }}
              </div>
            </div>

            <!-- 显示描述 -->
            <div v-if="goal.description" class="text-xs text-gray-600 mt-1 line-clamp-2">
              {{ stripHtml(goal.description) }}
            </div>

            <!-- 标签 -->
            <div v-if="goal.tags && goal.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
              <span v-for="tag in goal.tags" :key="tag"
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 状态标识 -->
          <div class="flex items-center gap-2">
            <span :class="[
              'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
              goal.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            ]">
              {{ goal.status === 'COMPLETED' ? '已完成' : '进行中' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="sortedGoals.length === 0" class="text-center py-12 text-gray-500">
        <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-sm">本日暂无任务</p>
        <button @click="$emit('add')"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          添加任务
        </button>
      </div>
    </div>

    <!-- 右键菜单 -->
    <div v-if="contextMenu.visible" :style="{
      position: 'fixed',
      left: `${contextMenu.x}px`,
      top: `${contextMenu.y}px`,
      zIndex: 9999
    }" class="bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]">
      <button @click.stop="moveToTop"
        class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11l7-7 7 7M5 19l7-7 7 7" />
        </svg>
        当天排序最前
      </button>
      <button @click.stop="deleteGoal"
        class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        删除
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Sortable from 'sortablejs'

interface Goal {
  id: string
  title: string
  description?: string
  status: string
  periodType: string
  periodValue: string
  folder?: any
  parent?: any
  tags?: string[]
  sortOrder?: number
}

interface Props {
  goals: Goal[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [goal: Goal]
  add: []
  reorder: [goalIds: string[]]
  moveToTop: [goal: Goal]
  delete: [goal: Goal]
}>()

const sortableContainer = ref<HTMLElement>()
const sortableInstance = ref<Sortable>()
const isDragging = ref(false)

// 右键菜单相关
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  goal: null as Goal | null
})

// 按 sortOrder 排序的目标（数值越大排名越前，已完成的放最后）
const sortedGoals = computed(() => {
  const goals = [...props.goals]
  return goals.sort((a, b) => {
    // 首先按状态排序：未完成在前，已完成在后
    if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') {
      return 1
    }
    if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') {
      return -1
    }

    // 状态相同时，按 sortOrder 降序排列
    const orderA = a.sortOrder ?? 0
    const orderB = b.sortOrder ?? 0
    return orderB - orderA  // 降序：大值在前
  })
})

// 处理目标点击
function handleGoalClick(goal: Goal) {
  emit('edit', goal)
}

// 处理右键菜单
function handleContextMenu(event: MouseEvent, goal: Goal) {
  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    goal
  }
}

// 关闭右键菜单
function closeContextMenu() {
  contextMenu.value.visible = false
}

// 点击外部关闭右键菜单
function handleClickOutside() {
  closeContextMenu()
}

// 当天排序最前
function moveToTop() {
  if (contextMenu.value.goal) {
    emit('moveToTop', contextMenu.value.goal)
    closeContextMenu()
  }
}

// 删除目标
function deleteGoal() {
  if (contextMenu.value.goal) {
    emit('delete', contextMenu.value.goal)
    closeContextMenu()
  }
}

// 获取文件夹路径
function getFolderPath(folder: any): string {
  const path = []
  let current = folder
  while (current) {
    path.unshift(current.name)
    current = current.parent
  }
  return path.join(' > ')
}

// 去除 HTML 标签
function stripHtml(html: string): string {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

// 获取周期类型标签
function getPeriodTypeLabel(periodType: string): string {
  const labels: Record<string, string> = {
    'YEAR': '年目标',
    'MONTH': '月目标',
    'WEEK': '周目标',
    'TASK': '任务',
    'CUSTOM': '自定义'
  }
  return labels[periodType] || periodType
}

// 获取周期类型样式类
function getPeriodTypeClass(periodType: string): string {
  const classes: Record<string, string> = {
    'YEAR': 'bg-purple-50 text-purple-700',
    'MONTH': 'bg-blue-50 text-blue-700',
    'WEEK': 'bg-green-50 text-green-700',
    'TASK': 'bg-orange-50 text-orange-700',
    'CUSTOM': 'bg-indigo-50 text-indigo-700'
  }
  return classes[periodType] || 'bg-gray-50 text-gray-700'
}

// 格式化周期值显示
function getPeriodValueDisplay(periodType: string, periodValue: string): string {
  if (!periodValue) return ''

  switch (periodType) {
    case 'YEAR':
      return `${periodValue}年`
    case 'MONTH':
      const [year, month] = periodValue.split('-')
      return `${year}年${month}月`
    case 'WEEK':
      const match = periodValue.match(/(\d+)-W(\d+)/)
      if (match) {
        return `${match[1]}年 第${match[2]}周`
      }
      return periodValue
    case 'TASK':
      return periodValue
    case 'CUSTOM':
      return periodValue
    default:
      return periodValue
  }
}

// 初始化 Sortable
onMounted(() => {
  if (sortableContainer.value) {
    sortableInstance.value = Sortable.create(sortableContainer.value, {
      animation: 150,
      handle: '.drag-handle',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      onStart: () => {
        isDragging.value = true
      },
      onEnd: (evt: any) => {
        isDragging.value = false

        // 获取新的排序
        const newOrder: string[] = []
        const items = sortableContainer.value?.children
        if (items) {
          for (let i = 0; i < items.length; i++) {
            const goalId = items[i].getAttribute('data-id')
            if (goalId) {
              newOrder.push(goalId)
            }
          }
        }

        // 触发重新排序事件
        if (newOrder.length > 0) {
          emit('reorder', newOrder)
        }
      }
    })
  }

  // 监听点击外部关闭菜单
  document.addEventListener('click', handleClickOutside)
})

// 清理
onUnmounted(() => {
  if (sortableInstance.value) {
    sortableInstance.value.destroy()
  }
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.day-view-list {
  min-height: 200px;
}

.day-view-item {
  transition: all 0.2s ease;
  cursor: pointer;
}

.day-view-item:hover {
  transform: translateY(-1px);
}

.drag-handle {
  user-select: none;
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}

.sortable-ghost {
  opacity: 0.4;
  background-color: #f3f4f6;
  border: 2px dashed #cbd5e1;
}

.sortable-chosen {
  cursor: grabbing;
}

.sortable-drag {
  opacity: 0.8;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
