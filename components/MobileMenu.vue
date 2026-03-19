<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 z-50 lg:hidden"
        @click="handleBackdropClick"
      />
    </Transition>

    <!-- Menu Panel -->
    <Transition name="slide">
      <div
        v-if="isOpen"
        class="fixed top-16 left-0 bottom-0 w-72 bg-white shadow-xl z-50 lg:hidden overflow-y-auto"
      >
        <nav class="p-4 space-y-1">
          <template v-for="item in menuItems" :key="item.path || item.section">
            <!-- Section Header -->
            <div
              v-if="item.section"
              class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4 first:mt-0"
            >
              {{ item.section }}
            </div>

            <!-- Menu Item -->
            <NuxtLink
              v-if="!item.section"
              :to="item.path"
              class="flex items-center px-3 py-3 rounded-lg transition-colors group"
              :class="isActive(item.path) ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
              @click="handleItemClick"
            >
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span class="ml-3 font-medium">{{ item.label }}</span>

              <!-- Badge -->
              <span
                v-if="item.badge"
                class="ml-auto bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full"
              >
                {{ item.badge }}
              </span>
            </NuxtLink>
          </template>
        </nav>

        <!-- User Info -->
        <div class="border-t border-gray-200 p-4 mt-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <span class="text-white font-medium">U</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">用户名</p>
              <p class="text-xs text-gray-500 truncate">user@example.com</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="border-t border-gray-200 p-4 mt-2">
          <button
            class="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            退出登录
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const route = useRoute()

const handleBackdropClick = () => {
  emit('close')
}

const handleItemClick = () => {
  emit('close')
}

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

// Icon components
const DashboardIcon = defineComponent({
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  `
})

const GoalsIcon = defineComponent({
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  `
})

const TasksIcon = defineComponent({
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  `
})

const NotesIcon = defineComponent({
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  `
})

const AnalyticsIcon = defineComponent({
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  `
})

const SettingsIcon = defineComponent({
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  `
})

const menuItems = computed(() => [
  { path: '/', label: '首页', icon: DashboardIcon },
  { section: '管理' },
  { path: '/goals', label: '目标管理', icon: GoalsIcon, badge: '新' },
  { path: '/tasks', label: '任务管理', icon: TasksIcon },
  { path: '/notes', label: '笔记管理', icon: NotesIcon },
  { path: '/analytics', label: '数据分析', icon: AnalyticsIcon },
  { section: '系统' },
  { path: '/settings', label: '系统设置', icon: SettingsIcon }
])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>