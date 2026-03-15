export default defineNuxtRouteMiddleware(async (to) => {
  const { user } = useAuth()

  if (!user.value) {
    const { data } = await useFetch('/api/auth/user')
    if (!data.value?.user) {
      // 避免在登录页上触发重定向循环
      if (to.path !== '/login') {
        return navigateTo('/login')
      }
    }
    user.value = data.value.user
  }
})
