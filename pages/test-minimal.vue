<template>
  <div class="space-y-4">
    <h1 class="text-3xl font-bold text-gray-900">最小化布局测试页面</h1>

    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
      <h2 class="text-lg font-semibold text-green-800 mb-2">✓ 此页面使用 'minimal' 布局</h2>
      <p class="text-green-700">您应该看到：</p>
      <ul class="list-disc list-inside mt-2 text-green-700">
        <li>蓝色顶部导航栏（写着"最小化布局"）</li>
        <li>灰色背景</li>
        <li>深色底部页脚</li>
      </ul>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-2">当前状态</h2>
      <ul class="space-y-1 text-sm">
        <li>📍 路由: {{ route.path }}</li>
        <li>🎨 布局: minimal</li>
        <li>🔧 SSR: {{ ssrDisabled ? '已禁用' : '已启用' }}</li>
      </ul>
    </div>

    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <h3 class="font-semibold mb-2">如果您看不到蓝色顶部栏</h3>
      <p class="text-sm mb-2">说明布局系统没有正常工作。请尝试：</p>
      <ol class="list-decimal list-inside text-sm space-y-1">
        <li>检查浏览器控制台（F12）是否有错误</li>
        <li>清除 .nuxt 缓存并重启服务器</li>
        <li>尝试直接访问根路径 /</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const ssrDisabled = config.ssr === false

definePageMeta({
  layout: 'minimal'
})

console.log('测试页面已加载，布局：minimal')
</script>
