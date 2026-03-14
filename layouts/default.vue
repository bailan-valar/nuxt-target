<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader @toggle-mobile-menu="toggleMobileMenu" />

    <div class="flex flex-1 pt-16">
      <AppSidebar />

      <main
        class="flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300"
        :class="{
          'lg:ml-64': !isSidebarCollapsed,
          'lg:ml-20': isSidebarCollapsed
        }"
      >
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>

    <AppFooter />

    <MobileMenu
      :is-open="isMobileMenuOpen"
      @close="closeMobileMenu"
    />
  </div>
</template>

<script setup lang="ts">
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

// Clean up body overflow on unmount
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>
