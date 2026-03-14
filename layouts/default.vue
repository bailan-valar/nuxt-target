<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 固定顶部导航 -->
    <div class="fixed top-0 left-0 right-0 z-50">
      <AppHeader @toggle-mobile-menu="toggleMobileMenu" />
    </div>

    <!-- 主内容区域 -->
    <div class="flex-1 pt-14">
      <!-- 侧边栏 (fixed 定位) -->
      <AppSidebar />

      <!-- 内容区域 -->
      <main
        class="p-3 sm:p-4 lg:p-5 transition-all duration-300"
        :class="isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-56'"
      >
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>

    <!-- 页脚 -->
    <footer
      class="transition-all duration-300"
      :class="isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-56'"
    >
      <AppFooter />
    </footer>

    <!-- 移动端菜单 -->
    <ClientOnly>
      <Teleport to="body">
        <MobileMenu
          v-if="isMobileMenuOpen"
          :is-open="isMobileMenuOpen"
          @close="closeMobileMenu"
        />
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
console.log('Default 布局已加载')

const {
  isMobileMenuOpen,
  isSidebarCollapsed,
  toggleMobileMenu,
  closeMobileMenu
} = useLayout()

// Close mobile menu on route change
const route = useRoute()
watch(() => route.path, () => {
  closeMobileMenu()
})

// Debug: 输出布局状态
onMounted(() => {
  console.log('布局已挂载', {
    路由: route.path,
    侧边栏折叠: isSidebarCollapsed.value,
    移动菜单打开: isMobileMenuOpen.value
  })
})
</script>
