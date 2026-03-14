<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-blue-600 mb-4">简单布局测试</h1>
    <p class="text-lg mb-4">如果您看到：</p>
    <ul class="list-disc list-inside space-y-2 mb-6">
      <li class="text-green-600">✓ 顶部有蓝色导航栏（白色背景，带 Logo）</li>
      <li class="text-green-600">✓ 左侧有白色侧边栏（带导航菜单）</li>
      <li class="text-green-600">✓ 右侧是主内容区域（灰色背景）</li>
      <li class="text-green-600">✓ 底部有页脚信息</li>
    </ul>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-2">当前路由</h2>
      <p class="text-gray-600 font-mono">{{ route.path }}</p>
    </div>

    <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p class="font-semibold mb-2">如果看不到导航栏和侧边栏：</p>
      <ol class="list-decimal list-inside space-y-1">
        <li>按 Ctrl+C 停止服务器</li>
        <li>删除 .nuxt 文件夹：<code>rm -rf .nuxt</code></li>
        <li>重新启动：<code>npm run dev</code></li>
        <li>清除浏览器缓存（Ctrl+Shift+R）</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

definePageMeta({
  layout: 'default'
})
</script>
