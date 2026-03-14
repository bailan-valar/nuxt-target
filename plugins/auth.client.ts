export default defineNuxtPlugin(async () => {
  const { user } = useAuth()

  if (!user.value) {
    try {
      const { data } = await $fetch('/api/auth/user')
      if (data?.user) {
        user.value = data.user
      }
    } catch {
      // 忽略错误，用户未登录
    }
  }
})
