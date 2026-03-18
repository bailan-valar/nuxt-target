<template>
  <transition name="fade">
    <div
      v-if="isVisible"
      class="slash-command-popup"
      :style="{ top: `${position.top}px`, left: `${position.left}px` }"
    >
      <div class="slash-command-header" v-if="filteredItems.length > 0">
        {{ activeCategory.label }}
      </div>
      <div class="slash-command-items" ref="itemsContainer">
        <button
          v-for="(item, index) in filteredItems"
          :key="item.id"
          :ref="(el) => setItemRef(el, index)"
          type="button"
          class="slash-command-item"
          :class="{ 'is-selected': selectedIndex === index }"
          @click="selectItem(item)"
          @mouseenter="selectedIndex = index"
        >
          <div class="item-icon">
            <component :is="item.icon" />
          </div>
          <div class="item-content">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-description">{{ item.description }}</div>
          </div>
        </button>
        <div v-if="filteredItems.length === 0" class="slash-command-empty">
          未找到匹配的命令
        </div>
      </div>
      <div class="slash-command-footer" v-if="filteredItems.length > 0">
        <div class="footer-hint">
          使用 <kbd>↑</kbd> <kbd>↓</kbd> 导航，<kbd>Enter</kbd> 选择，<kbd>Esc</kbd> 取消
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

interface CommandItem {
  id: string
  title: string
  description: string
  icon: any
  command: ({ editor, range }: { editor: any; range: any }) => void
  category: string
}

interface Props {
  isVisible: boolean
  position: { top: number; left: number }
  items: CommandItem[]
  query: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [item: CommandItem]
  close: []
}>()

const selectedIndex = ref(0)
const itemsContainer = ref<HTMLElement | null>(null)
const selectedItem = ref<HTMLElement | null>(null)
const itemRefs = ref<(HTMLElement | null)[]>([])

// 设置元素引用
const setItemRef = (el: any, index: number) => {
  if (el) {
    itemRefs.value[index] = el
    if (index === selectedIndex.value) {
      selectedItem.value = el
    }
  }
}

// 获取当前选中项的DOM元素
const getSelectedItem = () => {
  return itemRefs.value[selectedIndex.value] || null
}

// 命令分类
const categories = {
  basic: { label: '基础块', priority: 1 },
  text: { label: '文本格式', priority: 2 },
  list: { label: '列表', priority: 3 },
  media: { label: '媒体', priority: 4 },
  advanced: { label: '高级', priority: 5 }
}

// 过滤和排序命令
const filteredItems = computed(() => {
  let items = props.items

  // 根据搜索词过滤
  if (props.query) {
    const query = props.query.toLowerCase()
    items = items.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    )
  }

  // 按分类排序
  return items.sort((a, b) => {
    const priorityA = categories[a.category as keyof typeof categories]?.priority || 999
    const priorityB = categories[b.category as keyof typeof categories]?.priority || 999
    return priorityA - priorityB
  })
})

// 当前激活的分类
const activeCategory = computed(() => {
  if (filteredItems.value.length === 0) {
    return { label: '无结果' }
  }
  const firstItemCategory = filteredItems.value[0]?.category || 'basic'
  return categories[firstItemCategory as keyof typeof categories] || { label: '命令' }
})

// 选择项目
const selectItem = (item: CommandItem) => {
  emit('select', item)
}

// 自动滚动到选中项
watch(selectedIndex, async () => {
  await nextTick()

  const item = getSelectedItem()
  if (!itemsContainer.value || !item) return

  const container = itemsContainer.value
  const containerHeight = container.clientHeight
  const itemOffsetTop = item.offsetTop
  const itemHeight = item.offsetHeight

  // 如果选中项在可视区域上方
  if (itemOffsetTop < container.scrollTop) {
    container.scrollTop = itemOffsetTop
  }
  // 如果选中项在可视区域下方
  else if (itemOffsetTop + itemHeight > container.scrollTop + containerHeight) {
    container.scrollTop = itemOffsetTop + itemHeight - containerHeight
  }
})

// 键盘导航
const handleKeydown = (e: KeyboardEvent) => {
  if (!props.isVisible) return

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      e.stopPropagation()
      selectedIndex.value = (selectedIndex.value + 1) % filteredItems.value.length
      break
    case 'ArrowUp':
      e.preventDefault()
      e.stopPropagation()
      selectedIndex.value = selectedIndex.value === 0
        ? filteredItems.value.length - 1
        : selectedIndex.value - 1
      break
    case 'Enter':
      e.preventDefault()
      e.stopPropagation()
      if (filteredItems.value[selectedIndex.value]) {
        selectItem(filteredItems.value[selectedIndex.value])
      }
      break
    case 'Escape':
      e.preventDefault()
      e.stopPropagation()
      emit('close')
      break
  }
}

// 重置选中索引
watch(() => props.isVisible, () => {
  selectedIndex.value = 0
  itemRefs.value = []
})

watch(() => props.query, () => {
  selectedIndex.value = 0
  itemRefs.value = []
})

// 同步更新 selectedItem
watch(selectedIndex, (newIndex) => {
  selectedItem.value = getSelectedItem()
})

// 当 itemRefs 更新时也同步 selectedItem
watch(itemRefs, () => {
  selectedItem.value = getSelectedItem()
}, { deep: true })

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.slash-command-popup {
  @apply fixed z-[10000] w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden;
}

.slash-command-header {
  @apply px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wide;
}

.slash-command-items {
  @apply max-h-64 overflow-y-auto p-2;
}

.slash-command-item {
  @apply w-full flex items-start gap-3 px-3 py-2 rounded-lg text-left transition-all duration-150 hover:bg-gray-100;
}

.slash-command-item.is-selected {
  @apply bg-blue-50 hover:bg-blue-100;
}

.item-icon {
  @apply flex-shrink-0 w-8 h-8 flex items-center justify-center rounded bg-gray-100 text-gray-600;
}

.slash-command-item.is-selected .item-icon {
  @apply bg-blue-100 text-blue-600;
}

.item-icon svg {
  @apply w-4 h-4;
}

.item-content {
  @apply flex-1 min-w-0;
}

.item-title {
  @apply text-sm font-medium text-gray-900;
}

.item-description {
  @apply text-xs text-gray-500 mt-0.5 truncate;
}

.slash-command-empty {
  @apply px-3 py-8 text-center text-sm text-gray-500;
}

.slash-command-footer {
  @apply px-3 py-2 bg-gray-50 border-t border-gray-200;
}

.footer-hint {
  @apply text-xs text-gray-500 text-center;
}

.footer-hint kbd {
  @apply inline-flex items-center justify-center px-1.5 py-0.5 bg-gray-200 rounded text-gray-700 font-mono text-xs mx-0.5;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 滚动条样式 */
.slash-command-items::-webkit-scrollbar {
  width: 6px;
}

.slash-command-items::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

.slash-command-items::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full;
}

.slash-command-items::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}
</style>
