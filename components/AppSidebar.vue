<template>
  <aside
    class="fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 z-40 overflow-y-auto hidden lg:block"
    :class="collapsed ? 'w-20' : 'w-64'"
  >
    <nav class="p-4 space-y-1">
      <template v-for="item in menuItems" :key="item.path || item.section">
        <!-- Section Header -->
        <div
          v-if="item.section"
          class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4 first:mt-0"
          :class="{ 'hidden': collapsed }"
        >
          {{ item.section }}
        </div>

        <!-- Menu Item -->
        <NuxtLink
          v-if="!item.section"
          :to="item.path"
          class="flex items-center px-3 py-2 rounded-lg transition-colors group"
          :class="isActive(item.path) ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
          :title="collapsed ? item.label : ''"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span
            class="ml-3 font-medium transition-opacity whitespace-nowrap overflow-hidden"
            :class="{ 'opacity-0 w-0': collapsed, 'opacity-100 w-auto': !collapsed }"
          >
            {{ item.label }}
          </span>

          <!-- Badge -->
          <span
            v-if="item.badge && !collapsed"
            class="ml-auto bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
          >
            {{ item.badge }}
          </span>
        </NuxtLink>
      </template>
    </nav>

    <!-- Collapse Button -->
    <button
      @click="toggleSidebar"
      class="absolute bottom-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      :class="collapsed ? 'left-1/2 -translate-x-1/2' : 'right-4'"
      :title="collapsed ? '展开侧边栏' : '收起侧边栏'"
    >
      <svg
        class="w-5 h-5 text-gray-600 transition-transform"
        :class="{ 'rotate-180': !collapsed }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
      </svg>
    </button>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute()
const { isSidebarCollapsed, toggleSidebar } = useLayout()

const collapsed = computed(() => isSidebarCollapsed.value)

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
  { path: '/analytics', label: '数据分析', icon: AnalyticsIcon },
  { section: '系统' },
  { path: '/settings', label: '系统设置', icon: SettingsIcon }
])
</script>
