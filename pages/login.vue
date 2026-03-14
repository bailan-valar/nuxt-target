<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
    <div class="max-w-md w-full space-y-8 bg-white rounded-xl shadow-lg p-8">
      <!-- 头部 -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ isLoginMode ? '欢迎回来' : '创建账户' }}
        </h1>
        <p class="mt-2 text-sm text-gray-600">
          {{ isLoginMode ? '登录到您的账户' : '注册新账户' }}
        </p>
      </div>

      <!-- 登录表单 -->
      <form v-if="isLoginMode" class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <!-- 邮箱输入 -->
          <div>
            <label for="login-email" class="block text-sm font-medium text-gray-700">
              邮箱地址
            </label>
            <input
              id="login-email"
              v-model="loginForm.email"
              type="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <!-- 密码输入 -->
          <div>
            <label for="login-password" class="block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              id="login-password"
              v-model="loginForm.password"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
        </div>

        <!-- 记住我和忘记密码 -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember"
              v-model="loginForm.remember"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="remember" class="ml-2 block text-sm text-gray-700">
              记住我
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
              忘记密码？
            </a>
          </div>
        </div>

        <!-- 错误信息 -->
        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>

        <!-- 登录按钮 -->
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading">登录中...</span>
            <span v-else>登录</span>
          </button>
        </div>

        <!-- 切换到注册 -->
        <div class="text-center text-sm">
          <span class="text-gray-600">还没有账户？</span>
          <button
            type="button"
            @click="toggleMode"
            class="font-medium text-blue-600 hover:text-blue-500 ml-1"
          >
            立即注册
          </button>
        </div>
      </form>

      <!-- 注册表单 -->
      <form v-else class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <!-- 邮箱输入 -->
          <div>
            <label for="register-email" class="block text-sm font-medium text-gray-700">
              邮箱地址
            </label>
            <input
              id="register-email"
              v-model="registerForm.email"
              type="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <!-- 密码输入 -->
          <div>
            <label for="register-password" class="block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              id="register-password"
              v-model="registerForm.password"
              type="password"
              required
              minlength="8"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="至少8个字符"
            />
            <p class="mt-1 text-xs text-gray-500">密码至少需要8个字符</p>
          </div>

          <!-- 确认密码输入 -->
          <div>
            <label for="register-confirm-password" class="block text-sm font-medium text-gray-700">
              确认密码
            </label>
            <input
              id="register-confirm-password"
              v-model="registerForm.confirmPassword"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="再次输入密码"
            />
          </div>
        </div>

        <!-- 密码不匹配提示 -->
        <div v-if="registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword" class="rounded-md bg-red-50 p-4">
          <p class="text-sm text-red-800">两次输入的密码不一致</p>
        </div>

        <!-- 错误信息 -->
        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>

        <!-- 成功信息 -->
        <div v-if="success" class="rounded-md bg-green-50 p-4">
          <p class="text-sm text-green-800">{{ success }}</p>
        </div>

        <!-- 注册按钮 -->
        <div>
          <button
            type="submit"
            :disabled="loading || registerForm.password !== registerForm.confirmPassword"
            class="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading">注册中...</span>
            <span v-else>注册</span>
          </button>
        </div>

        <!-- 切换到登录 -->
        <div class="text-center text-sm">
          <span class="text-gray-600">已有账户？</span>
          <button
            type="button"
            @click="toggleMode"
            class="font-medium text-blue-600 hover:text-blue-500 ml-1"
          >
            立即登录
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
interface LoginForm {
  email: string
  password: string
  remember: boolean
}

interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
}

const loginForm = reactive<LoginForm>({
  email: '',
  password: '',
  remember: false
})

const registerForm = reactive<RegisterForm>({
  email: '',
  password: '',
  confirmPassword: ''
})

const isLoginMode = ref(true)
const loading = ref(false)
const error = ref('')
const success = ref('')

// 使用 minimal 布局（不包含侧边栏和复杂的导航）
definePageMeta({
  layout: 'minimal'
})

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  error.value = ''
  success.value = ''

  // 清空表单
  if (isLoginMode.value) {
    registerForm.email = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
  } else {
    loginForm.email = ''
    loginForm.password = ''
    loginForm.remember = false
  }
}

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await $fetch('/api/auth/signin', {
      method: 'POST',
      body: {
        email: loginForm.email,
        password: loginForm.password,
        rememberMe: loginForm.remember
      }
    })

    // 登录成功后跳转到首页
    await navigateTo('/')

  } catch (err: any) {
    error.value = err.data?.message || '登录失败，请检查您的凭据'
    console.error('登录错误:', err)
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''

    // 验证密码匹配
    if (registerForm.password !== registerForm.confirmPassword) {
      error.value = '两次输入的密码不一致'
      return
    }

    // 验证密码长度
    if (registerForm.password.length < 8) {
      error.value = '密码至少需要8个字符'
      return
    }

    const response = await $fetch('/api/auth/signup', {
      method: 'POST',
      body: {
        email: registerForm.email,
        password: registerForm.password
      }
    })

    // 注册成功
    success.value = '账户创建成功！正在跳转到登录...'

    // 2秒后切换到登录模式
    setTimeout(() => {
      toggleMode()
      // 预填充邮箱
      loginForm.email = registerForm.email
    }, 2000)

  } catch (err: any) {
    error.value = err.data?.message || '注册失败，请稍后重试'
    console.error('注册错误:', err)
  } finally {
    loading.value = false
  }
}
</script>
