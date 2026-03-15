<template>
  <div class="max-w-4xl mx-auto">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        联系我们
      </h1>
      <p class="text-sm text-gray-600">
        我们很乐意听到您的声音
      </p>
    </div>

    <!-- 联系信息卡片 -->
    <div class="bg-white rounded-lg shadow-sm p-8 mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">
        取得联系
      </h2>
      <p class="text-gray-700 leading-relaxed mb-6">
        无论您有任何问题、建议或反馈，我们都非常乐意听取您的意见。请通过以下方式与我们联系，我们将尽快回复您。
      </p>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- 邮箱联系 -->
        <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">电子邮箱</h3>
            <p class="text-gray-600">support@example.com</p>
            <p class="text-sm text-gray-500 mt-1">一般咨询与技术支持</p>
          </div>
        </div>

        <!-- 商务合作 -->
        <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">商务合作</h3>
            <p class="text-gray-600">business@example.com</p>
            <p class="text-sm text-gray-500 mt-1">商务洽谈与合作机会</p>
          </div>
        </div>

        <!-- 技术支持 -->
        <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">开发者社区</h3>
            <p class="text-gray-600">dev@example.com</p>
            <p class="text-sm text-gray-500 mt-1">API 集成与开发者支持</p>
          </div>
        </div>

        <!-- 客服时间 -->
        <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">客服时间</h3>
            <p class="text-gray-600">周一至周五 9:00 - 18:00</p>
            <p class="text-sm text-gray-500 mt-1">节假日可能会延迟回复</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 联系表单 -->
    <div class="bg-white rounded-lg shadow-sm p-8 mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">
        发送消息
      </h2>
      <p class="text-gray-700 leading-relaxed mb-6">
        您也可以通过下面的表单直接向我们发送消息。请填写必要的信息，我们会尽快回复您。
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 姓名 -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            姓名 <span class="text-red-500">*</span>
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="请输入您的姓名"
          />
        </div>

        <!-- 邮箱 -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            电子邮箱 <span class="text-red-500">*</span>
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="请输入您的邮箱地址"
          />
        </div>

        <!-- 主题 -->
        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
            主题 <span class="text-red-500">*</span>
          </label>
          <select
            id="subject"
            v-model="form.subject"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          >
            <option value="">请选择主题</option>
            <option value="general">一般咨询</option>
            <option value="technical">技术支持</option>
            <option value="business">商务合作</option>
            <option value="feedback">产品反馈</option>
            <option value="other">其他</option>
          </select>
        </div>

        <!-- 消息内容 -->
        <div>
          <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
            消息内容 <span class="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            v-model="form.message"
            rows="6"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
            placeholder="请输入您的消息内容..."
          />
        </div>

        <!-- 提交按钮 -->
        <div class="flex items-center justify-end space-x-4">
          <button
            type="button"
            @click="handleReset"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            重置
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting">发送中...</span>
            <span v-else>发送消息</span>
          </button>
        </div>
      </form>

      <!-- 成功提示 -->
      <div v-if="showSuccess" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <p class="text-green-800">
            感谢您的消息！我们已收到您的来信，将在 1-2 个工作日内回复您。
          </p>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="showError" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <p class="text-red-800">
            抱歉，发送消息时出现错误。请稍后再试或直接发送邮件至 support@example.com
          </p>
        </div>
      </div>
    </div>

    <!-- 其他联系方式 -->
    <div class="bg-white rounded-lg shadow-sm p-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">
        关注我们
      </h2>
      <p class="text-gray-700 leading-relaxed mb-6">
        关注我们的社交媒体账号，获取最新动态和产品更新。
      </p>

      <div class="flex flex-wrap gap-4">
        <!-- Twitter -->
        <a
          href="#"
          class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
          Twitter
        </a>

        <!-- GitHub -->
        <a
          href="#"
          class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
          </svg>
          GitHub
        </a>

        <!-- LinkedIn -->
        <a
          href="#"
          class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          LinkedIn
        </a>
      </div>
    </div>

    <!-- 返回首页按钮 -->
    <div class="mt-8 text-center">
      <NuxtLink
        to="/"
        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        返回首页
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// 设置页面元信息
useHead({
  title: '联系我们',
  meta: [
    {
      name: 'description',
      content: '联系我们获取帮助、提供反馈或探索合作机会'
    }
  ]
})

// 表单状态
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const showSuccess = ref(false)
const showError = ref(false)

// 重置表单
const handleReset = () => {
  form.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  }
  showSuccess.value = false
  showError.value = false
}

// 提交表单
const handleSubmit = async () => {
  isSubmitting.value = true
  showSuccess.value = false
  showError.value = false

  try {
    // TODO: 实际项目中这里应该调用 API 接口发送邮件或保存到数据库
    // const response = await $fetch('/api/contact', {
    //   method: 'POST',
    //   body: form.value
    // })

    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 显示成功消息
    showSuccess.value = true

    // 重置表单
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }

    // 3秒后隐藏成功消息
    setTimeout(() => {
      showSuccess.value = false
    }, 5000)
  } catch (error) {
    console.error('发送消息失败:', error)
    showError.value = true

    // 5秒后隐藏错误消息
    setTimeout(() => {
      showError.value = false
    }, 5000)
  } finally {
    isSubmitting.value = false
  }
}
</script>
