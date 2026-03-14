export function useAuth() {
  const user = useState('user', () => null)

  const signInWithPassword = async (email: string, password: string, rememberMe = false) => {
    const { data } = await $fetch('/api/auth/signin', {
      method: 'POST',
      body: { email, password, rememberMe }
    })
    user.value = data.user
  }

  const signUp = async (email: string, password: string) => {
    await $fetch('/api/auth/signup', {
      method: 'POST',
      body: { email, password }
    })
  }

  const signOut = async () => {
    await $fetch('/api/auth/signout', { method: 'POST' })
    user.value = null
    await navigateTo('/')
  }

  return {
    user,
    signInWithPassword,
    signUp,
    signOut
  }
}
