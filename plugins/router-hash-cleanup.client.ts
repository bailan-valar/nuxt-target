export default defineNuxtPlugin(() => {
  const router = useRouter()

  router.beforeEach((to) => {
    if (to.hash && to.hash.includes('error=')) {
      return { ...to, hash: '' }
    }
  })
})
