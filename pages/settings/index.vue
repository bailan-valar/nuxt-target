<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">系统设置</h1>
        <p class="text-sm text-gray-600 mt-1">管理您的账户和偏好设置</p>
      </div>
    </div>

    <!-- 设置选项卡 -->
    <div class="border-b border-gray-200">
      <nav class="flex space-x-8 -mb-px">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === tab.key
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <component :is="tab.icon" class="w-4 h-4 inline-block mr-2" />
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- 个人资料 -->
    <div v-if="activeTab === 'profile'" class="space-y-6">
      <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">个人资料</h2>
          <p class="text-sm text-gray-600 mt-1">更新您的个人信息</p>
        </div>

        <form @submit.prevent="handleUpdateProfile" class="p-6 space-y-6">
          <!-- 头像 -->
          <div class="flex items-center gap-6">
            <div class="relative">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold">
                {{ userInitial }}
              </div>
              <button
                type="button"
                class="absolute bottom-0 right-0 inline-flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                title="更换头像"
              >
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-900">头像</h3>
              <p class="text-sm text-gray-500 mt-1">支持 JPG、PNG 格式，最大 2MB</p>
            </div>
          </div>

          <!-- 姓名 -->
          <div class="grid gap-6 sm:grid-cols-2">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">
                姓名 <span class="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                v-model="profileForm.name"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="请输入您的姓名"
              />
            </div>
          </div>

          <!-- 邮箱 -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              邮箱地址
            </label>
            <input
              id="email"
              :value="user?.email"
              type="email"
              disabled
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-500 sm:text-sm cursor-not-allowed"
            />
            <p class="mt-1 text-sm text-gray-500">邮箱地址不可修改</p>
          </div>

          <!-- 简介 -->
          <div>
            <label for="bio" class="block text-sm font-medium text-gray-700">
              个人简介
            </label>
            <textarea
              id="bio"
              v-model="profileForm.bio"
              rows="4"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="介绍一下自己..."
            />
          </div>

          <!-- 按钮 -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="resetProfileForm"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              保存更改
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 账户安全 -->
    <div v-if="activeTab === 'security'" class="space-y-6">
      <!-- 修改密码 -->
      <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">修改密码</h2>
          <p class="text-sm text-gray-600 mt-1">定期更换密码以保护账户安全</p>
        </div>

        <form @submit.prevent="handleChangePassword" class="p-6 space-y-6">
          <!-- 当前密码 -->
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700">
              当前密码 <span class="text-red-500">*</span>
            </label>
            <input
              id="currentPassword"
              v-model="passwordForm.currentPassword"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="请输入当前密码"
            />
          </div>

          <!-- 新密码 -->
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700">
              新密码 <span class="text-red-500">*</span>
            </label>
            <input
              id="newPassword"
              v-model="passwordForm.newPassword"
              type="password"
              required
              minlength="8"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="至少 8 个字符"
            />
          </div>

          <!-- 确认新密码 -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              确认新密码 <span class="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              v-model="passwordForm.confirmPassword"
              type="password"
              required
              minlength="8"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="再次输入新密码"
            />
          </div>

          <!-- 按钮 -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="resetPasswordForm"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              更新密码
            </button>
          </div>
        </form>
      </div>

      <!-- 登录会话 -->
      <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">登录会话</h2>
          <p class="text-sm text-gray-600 mt-1">管理您在各设备上的登录状态</p>
        </div>

        <div class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-900">当前设备</h3>
                <p class="text-sm text-gray-500">Windows · Chrome</p>
              </div>
            </div>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              当前
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 偏好设置 -->
    <div v-if="activeTab === 'preferences'" class="space-y-6">
      <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">界面偏好</h2>
          <p class="text-sm text-gray-600 mt-1">自定义您的使用体验</p>
        </div>

        <div class="p-6 space-y-6">
          <!-- 主题设置 -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">深色模式</h3>
              <p class="text-sm text-gray-500 mt-1">切换深色/浅色主题</p>
            </div>
            <button
              @click="toggleDarkMode"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  isDarkMode ? 'translate-x-5' : 'translate-x-0'
                ]"
              />
            </button>
          </div>

          <hr class="border-gray-200" />

          <!-- 语言设置 -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">语言</h3>
              <p class="text-sm text-gray-500 mt-1">选择界面显示语言</p>
            </div>
            <select
              v-model="preferences.language"
              class="block w-40 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
            >
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
            </select>
          </div>

          <hr class="border-gray-200" />

          <!-- 时区设置 -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">时区</h3>
              <p class="text-sm text-gray-500 mt-1">选择您的时区</p>
            </div>
            <select
              v-model="preferences.timezone"
              class="block w-60 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
            >
              <option value="Asia/Shanghai">中国标准时间 (UTC+8)</option>
              <option value="Asia/Tokyo">日本标准时间 (UTC+9)</option>
              <option value="America/New_York">美东时间 (UTC-5)</option>
              <option value="America/Los_Angeles">美西时间 (UTC-8)</option>
              <option value="Europe/London">格林威治时间 (UTC+0)</option>
            </select>
          </div>

          <hr class="border-gray-200" />

          <!-- 侧边栏设置 -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">侧边栏</h3>
              <p class="text-sm text-gray-500 mt-1">切换侧边栏展开/收起状态</p>
            </div>
            <button
              @click="toggleSidebar"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {{ isSidebarCollapsed ? '展开' : '收起' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 通知设置 -->
    <div v-if="activeTab === 'notifications'" class="space-y-6">
      <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">通知设置</h2>
          <p class="text-sm text-gray-600 mt-1">选择您希望接收的通知类型</p>
        </div>

        <div class="p-6 space-y-6">
          <!-- 邮件通知 -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">邮件通知</h3>
              <p class="text-sm text-gray-500 mt-1">接收重要更新的邮件通知</p>
            </div>
            <button
              @click="notifications.email = !notifications.email"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                notifications.email ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  notifications.email ? 'translate-x-5' : 'translate-x-0'
                ]"
              />
            </button>
          </div>

          <hr class="border-gray-200" />

          <!-- 目标提醒 -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">目标提醒</h3>
              <p class="text-sm text-gray-500 mt-1">目标截止日期提醒</p>
            </div>
            <button
              @click="notifications.goals = !notifications.goals"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                notifications.goals ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  notifications.goals ? 'translate-x-5' : 'translate-x-0'
                ]"
              />
            </button>
          </div>

          <hr class="border-gray-200" />

          <!-- 任务提醒 -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">任务提醒</h3>
              <p class="text-sm text-gray-500 mt-1">任务即将到期提醒</p>
            </div>
            <button
              @click="notifications.tasks = !notifications.tasks"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                notifications.tasks ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  notifications.tasks ? 'translate-x-5' : 'translate-x-0'
                ]"
              />
            </button>
          </div>

          <hr class="border-gray-200" />

          <!-- 每周报告 -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">每周报告</h3>
              <p class="text-sm text-gray-500 mt-1">每周目标进度汇总</p>
            </div>
            <button
              @click="notifications.weeklyReport = !notifications.weeklyReport"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                notifications.weeklyReport ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  notifications.weeklyReport ? 'translate-x-5' : 'translate-x-0'
                ]"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast 通知 -->
    <ClientOnly>
      <ToastContainer />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { user, signOut } = useAuth()
const { isSidebarCollapsed, toggleSidebar } = useLayout()
const { showToast } = useToast()

// 当前激活的选项卡
const activeTab = ref('profile')

// 提交状态
const isSubmitting = ref(false)

// 个人资料表单
const profileForm = ref({
  name: '',
  bio: ''
})

// 密码表单
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 偏好设置
const preferences = ref({
  language: 'zh-CN',
  timezone: 'Asia/Shanghai',
  theme: 'light'
})

// 通知设置
const notifications = ref({
  email: true,
  goals: true,
  tasks: true,
  weeklyReport: false
})

// 深色模式
const isDarkMode = computed(() => preferences.value.theme === 'dark')

// 选项卡配置
const tabs = [
  {
    key: 'profile',
    label: '个人资料',
    icon: defineComponent({
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      `
    })
  },
  {
    key: 'security',
    label: '账户安全',
    icon: defineComponent({
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      `
    })
  },
  {
    key: 'preferences',
    label: '偏好设置',
    icon: defineComponent({
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      `
    })
  },
  {
    key: 'notifications',
    label: '通知设置',
    icon: defineComponent({
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      `
    })
  }
]

// 用户名首字母
const userInitial = computed(() => {
  if (!user.value?.name) return 'U'
  return user.value.name.charAt(0).toUpperCase()
})

// 初始化表单数据
onMounted(() => {
  if (user.value) {
    profileForm.value.name = user.value.name || ''
  }
})

// 更新个人资料
const handleUpdateProfile = async () => {
  try {
    isSubmitting.value = true

    // TODO: 调用 API 更新用户资料
    // const { data } = await $fetch('/api/user/profile', {
    //   method: 'PATCH',
    //   body: profileForm.value
    // })

    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    showToast('个人资料已更新', 'success')
  } catch (error) {
    console.error('更新个人资料失败:', error)
    showToast('更新失败，请重试', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// 修改密码
const handleChangePassword = async () => {
  try {
    // 验证密码
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      showToast('两次输入的密码不一致', 'error')
      return
    }

    if (passwordForm.value.newPassword.length < 8) {
      showToast('新密码至少需要 8 个字符', 'error')
      return
    }

    isSubmitting.value = true

    // TODO: 调用 API 修改密码
    // const { data } = await $fetch('/api/user/change-password', {
    //   method: 'POST',
    //   body: {
    //     currentPassword: passwordForm.value.currentPassword,
    //     newPassword: passwordForm.value.newPassword
    //   }
    // })

    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    showToast('密码已更新', 'success')
    resetPasswordForm()
  } catch (error) {
    console.error('修改密码失败:', error)
    showToast('修改密码失败，请重试', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// 重置个人资料表单
const resetProfileForm = () => {
  if (user.value) {
    profileForm.value.name = user.value.name || ''
  }
  profileForm.value.bio = ''
}

// 重置密码表单
const resetPasswordForm = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

// 切换深色模式
const toggleDarkMode = () => {
  preferences.value.theme = isDarkMode.value ? 'light' : 'dark'
  showToast(`${isDarkMode.value ? '浅色' : '深色'}模式已启用`, 'success')
}

// 退出登录
const handleSignOut = async () => {
  try {
    await signOut()
    await navigateTo('/login')
  } catch (error) {
    console.error('退出登录失败:', error)
    showToast('退出登录失败，请重试', 'error')
  }
}
</script>
