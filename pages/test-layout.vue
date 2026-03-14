<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">布局测试页面</h1>
    <p class="mb-4">如果您看到顶部导航栏和侧边栏，说明布局已经正确应用！</p>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-2">检查项：</h2>
      <ul class="list-disc list-inside space-y-2">
        <li>✓ 顶部导航栏（包含 Logo、搜索、用户菜单）</li>
        <li>✓ 左侧边栏（包含导航菜单）</li>
        <li>✓ 响应式设计（移动端显示汉堡菜单）</li>
        <li>✓ 底部页脚</li>
      </ul>
    </div>

    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
      <p class="text-sm"><strong>提示：</strong>如果看不到导航栏和侧边栏，请尝试：</p>
      <ol class="list-decimal list-inside mt-2 text-sm space-y-1">
        <li>重启开发服务器（Ctrl+C 然后 npm run dev）</li>
        <li>清除浏览器缓存（Ctrl+Shift+R）</li>
        <li>检查浏览器控制台是否有错误</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>
