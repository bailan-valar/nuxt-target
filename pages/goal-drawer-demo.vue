<template>
  <div class="demo-page">
    <div class="container">
      <h1 class="page-title">目标编辑抽屉演示</h1>

      <div class="demo-section">
        <h2 class="section-title">使用示例</h2>

        <div class="button-group">
          <button
            @click="openNewGoal"
            class="demo-btn demo-btn-primary"
          >
            新建目标
          </button>

          <button
            @click="openExistingGoal"
            class="demo-btn demo-btn-secondary"
          >
            编辑现有目标
          </button>
        </div>

        <div class="info-box">
          <h3>特点：</h3>
          <ul class="feature-list">
            <li>✨ 仿 Notion 风格的抽屉设计</li>
            <li>📝 无边框富文本编辑器</li>
            <li>🎨 图标选择器</li>
            <li>📊 右侧属性面板</li>
            <li>💾 自动保存功能</li>
            <li>🔔 实时保存状态提示</li>
            <li>📱 响应式设计</li>
          </ul>
        </div>

        <div class="code-example">
          <h3>代码示例：</h3>
          <pre class="code-block"><code>&lt;GoalEditDrawer
  :show="showDrawer"
  :goal="selectedGoal"
  @close="showDrawer = false"
  @saved="onSaved"
/&gt;</code></pre>
        </div>
      </div>
    </div>

    <!-- 目标编辑抽屉 -->
    <GoalEditDrawer
      :show="showDrawer"
      :goal="selectedGoal"
      @close="handleClose"
      @saved="handleSaved"
      @deleted="handleDeleted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GoalEditDrawer from '~/components/GoalEditDrawer.vue'

interface Goal {
  id: string
  title: string
  description: string | null
  status: string
  icon?: string | null
  folderId?: string | null
}

const showDrawer = ref(false)
const selectedGoal = ref<Goal | undefined>(undefined)

// 示例目标数据
const exampleGoal: Goal = {
  id: '1',
  title: '完成项目开发',
  description: '<p>这是一个<b>示例目标</b>，使用 Notion 风格的富文本编辑器。</p><ul><li>第一阶段：需求分析</li><li>第二阶段：开发实现</li><li>第三阶段：测试上线</li></ul>',
  status: 'IN_PROGRESS',
  icon: '🚀',
  folderId: null
}

const openNewGoal = () => {
  selectedGoal.value = undefined
  showDrawer.value = true
}

const openExistingGoal = () => {
  selectedGoal.value = exampleGoal
  showDrawer.value = true
}

const handleClose = () => {
  showDrawer.value = false
}

const handleSaved = () => {
  const { success } = useToast()
  success('目标已保存')

  // 刷新数据或其他操作
  console.log('目标已保存')
}

const handleDeleted = () => {
  const { success } = useToast()
  success('目标已删除')

  // 刷新数据或其他操作
  console.log('目标已删除')
}
</script>

<style scoped>
.demo-page {
  @apply min-h-screen bg-gray-50 py-12;
}

.container {
  @apply max-w-4xl mx-auto px-6;
}

.page-title {
  @apply text-4xl font-bold text-gray-900 mb-8;
}

.demo-section {
  @apply bg-white rounded-lg shadow-sm p-8;
}

.section-title {
  @apply text-2xl font-semibold text-gray-900 mb-6;
}

.button-group {
  @apply flex gap-4 mb-8;
}

.demo-btn {
  @apply px-6 py-3 rounded-lg font-medium transition-colors duration-150;
}

.demo-btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.demo-btn-secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}

.info-box {
  @apply bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8;
}

.info-box h3 {
  @apply text-lg font-semibold text-blue-900 mb-3;
}

.feature-list {
  @apply space-y-2;
}

.feature-list li {
  @apply text-blue-800;
}

.code-example {
  @apply bg-gray-900 rounded-lg p-6;
}

.code-example h3 {
  @apply text-lg font-semibold text-white mb-4;
}

.code-block {
  @apply overflow-x-auto;
}

.code-block code {
  @apply text-sm text-green-400 font-mono;
}
</style>
