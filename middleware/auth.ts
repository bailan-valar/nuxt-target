export default defineNuxtRouteMiddleware(async () => {
  const { user } = useAuth()

  if (!user.value) {
    const { data } = await useFetch('/api/auth/user')
    if (!data.value?.user) {
      return navigateTo('/')
    }
    user.value = data.value.user
  }
})
