<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
    <div class="flex items-center justify-between h-16 px-4">
      <!-- Logo and Brand -->
      <div class="flex items-center space-x-4">
        <button
          @click="toggleSidebar"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <NuxtLink to="/" class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span class="text-xl font-bold text-gray-900 hidden sm:block">系统名称</span>
        </NuxtLink>
      </div>

      <!-- Search Bar -->
      <div class="flex-1 max-w-xl mx-4 hidden md:block">
        <div class="relative">
          <input
            type="text"
            placeholder="搜索..."
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center space-x-2">
        <!-- Notifications -->
        <button
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
          aria-label="Notifications"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <!-- User Menu -->
        <div class="relative user-menu-container">
          <button
            @click="toggleUserMenu"
            class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">U</span>
            </div>
            <svg class="w-4 h-4 text-gray-600 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
          >
            <NuxtLink
              to="/profile"
              class="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              @click="showUserMenu = false"
            >
              个人资料
            </NuxtLink>
            <NuxtLink
              to="/settings"
              class="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              @click="showUserMenu = false"
            >
              设置
            </NuxtLink>
            <hr class="my-1 border-gray-200" />
            <button
              @click="handleSignOut"
              class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const showUserMenu = ref(false)

const emit = defineEmits<{
  toggleMobileMenu: []
}>()

const toggleSidebar = () => {
  emit('toggleMobileMenu')
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleSignOut = async () => {
  showUserMenu.value = false
  const { signOut } = useAuth()
  try {
    await signOut()
    await navigateTo('/')
  } catch (error) {
    console.error('Sign out error:', error)
  }
}

// Close dropdown when clicking outside
const closeDropdown = () => {
  showUserMenu.value = false
}

// Handle click outside
onMounted(() => {
  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement
    if (target && !target.closest('.user-menu-container')) {
      closeDropdown()
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>
