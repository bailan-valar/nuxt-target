<template>
  <aside
    class="fixed left-0 top-14 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 z-40 overflow-y-auto hidden lg:block"
    :class="collapsed ? 'w-16' : 'w-56'"
  >
    <nav class="p-3 space-y-0.5">
      <template v-for="item in menuItems" :key="item.path || item.section">
        <!-- Section Header -->
        <div
          v-if="item.section"
          class="px-2.5 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-3 first:mt-0"
          :class="{ 'hidden': collapsed }"
        >
          {{ item.section }}
        </div>

        <!-- Menu Item -->
        <NuxtLink
          v-if="!item.section"
          :to="item.path"
          class="flex items-center px-2.5 py-1.5 rounded-md transition-colors group"
          :class="isActive(item.path) ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
          :title="collapsed ? item.label : ''"
        >
          <component :is="item.icon" class="w-4 h-4 flex-shrink-0" />
          <span
            class="ml-2 text-sm font-medium transition-opacity whitespace-nowrap overflow-hidden"
            :class="{ 'opacity-0 w-0': collapsed, 'opacity-100 w-auto': !collapsed }"
          >
            {{ item.label }}
          </span>

          <!-- Badge -->
          <span
            v-if="item.badge && !collapsed"
            class="ml-auto bg-blue-100 text-blue-700 text-xs font-medium px-1.5 py-0.5 rounded-full flex-shrink-0"
          >
            {{ item.badge }}
          </span>
        </NuxtLink>
      </template>
    </nav>

    <!-- Collapse Button -->
    <button
      @click="toggleSidebar"
      class="absolute bottom-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
      :class="collapsed ? 'left-1/2 -translate-x-1/2' : 'right-3'"
      :title="collapsed ? '展开侧边栏' : '收起侧边栏'"
    >
      <svg
        class="w-4 h-4 text-gray-600 transition-transform"
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
import { h } from 'vue'

const route = useRoute()
const { isSidebarCollapsed, toggleSidebar } = useLayout()

const collapsed = computed(() => isSidebarCollapsed.value)

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

// Icon components - 使用 render 函数代替 template
const DashboardIcon = defineComponent({
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: '2',
        d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
      })
    ])
  }
})

const GoalsIcon = defineComponent({
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: '2',
        d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
      })
    ])
  }
})

const FoldersIcon = defineComponent({
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: '2',
        d: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
      })
    ])
  }
})

const SettingsIcon = defineComponent({
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: '2',
        d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
      }),
      h('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: '2',
        d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'
      })
    ])
  }
})

const ProfileIcon = defineComponent({
  render() {
    return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: '2',
        d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
      })
    ])
  }
})

const menuItems = computed(() => [
  { path: '/', label: '首页', icon: DashboardIcon },
  { section: '管理' },
  { path: '/goals', label: '目标管理', icon: GoalsIcon },
  { path: '/folders', label: '文件夹管理', icon: FoldersIcon },
 // { path: '/tasks', label: '任务管理', icon: TasksIcon },
//  { path: '/analytics', label: '数据分析', icon: AnalyticsIcon },
  { section: '系统' },
  { path: '/profile', label: '个人资料', icon: ProfileIcon },
  { path: '/settings', label: '系统设置', icon: SettingsIcon }
])
</script>
