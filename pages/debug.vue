<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-bold">布局调试页面</h1>

    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
      <p class="font-semibold text-green-800">✓ 此页面已明确设置 layout: 'default'</p>
    </div>

    <div class="bg-white rounded-lg shadow p-4 space-y-2">
      <h2 class="font-semibold text-lg">当前状态：</h2>
      <ul class="space-y-1 text-sm">
        <li>📍 当前路由：{{ route.path }}</li>
        <li>🎨 布局状态：{{ layoutActive ? '已激活' : '未激活' }}</li>
        <li>📱 设备类型：{{ isMobile ? '移动端' : '桌面端' }}</li>
      </ul>
    </div>

    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 class="font-semibold mb-2">如果您看不到：</h3>
      <ul class="text-sm space-y-1">
        <li>❌ 顶部导航栏（蓝色背景）</li>
        <li>❌ 左侧边栏（白色背景）</li>
        <li>❌ 移动端汉堡菜单</li>
      </ul>
      <p class="mt-2 text-sm font-semibold">请执行以下步骤：</p>
      <ol class="text-sm mt-1 space-y-1 list-decimal list-inside">
        <li>停止开发服务器（Ctrl+C）</li>
        <li>删除 .nuxt 目录：`rm -rf .nuxt`</li>
        <li>重新启动：`npm run dev`</li>
        <li>硬刷新浏览器（Ctrl+Shift+R）</li>
      </ol>
    </div>

    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <p class="text-sm">
        <strong>测试步骤：</strong><br>
        1. 访问 <code class="bg-yellow-100 px-1 rounded">/test-layout</code> 查看简单布局<br>
        2. 访问 <code class="bg-yellow-100 px-1 rounded">/debug</code> 查看此页面<br>
        3. 检查浏览器控制台是否有错误
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const route = useRoute()
const layoutActive = ref(true)
const isMobile = ref(false)

onMounted(() => {
  // 检查是否有布局元素
  const header = document.querySelector('header')
  const aside = document.querySelector('aside')
  const footer = document.querySelector('footer')

  layoutActive.value = !!(header || aside || footer)
  isMobile.value = window.innerWidth < 1024

  console.log('调试信息：', {
    有header: !!header,
    有aside: !!aside,
    有footer: !!footer,
    路由: route.path
  })
})
</script>
