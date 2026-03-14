<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 简单的顶部栏 -->
    <header class="bg-blue-600 text-white p-4 shadow-md">
      <div class="container mx-auto">
        <h1 class="text-xl font-bold">最小化布局 - 顶部导航栏</h1>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="container mx-auto p-6">
      <slot />
    </main>

    <!-- 简单的底部 -->
    <footer class="bg-gray-800 text-white p-4 mt-8">
      <div class="container mx-auto text-center">
        <p>© 2024 最小化布局 - 底部页脚</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// 最小化布局，不使用任何复杂的 composables
console.log('最小化布局已加载')
</script>
