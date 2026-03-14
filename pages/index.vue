<template>
  <div class="container">
    <h1>Goal Management</h1>
    <p v-if="authError" class="error">{{ authError }}</p>
    <ClientOnly>
      <AuthForm v-if="!user" />
    </ClientOnly>
    <div v-if="user">
      <p>Welcome! <button @click="handleSignOut">Sign Out</button></p>
      <NuxtLink to="/goals">Go to Goals</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, signOut } = useAuth()
const route = useRoute()
const authError = ref('')

onMounted(async () => {
  if (route.hash) {
    const params = new URLSearchParams(route.hash.slice(1))
    const error = params.get('error_description')
    if (error) {
      authError.value = error
      await navigateTo('/', { replace: true })
    }
  }

  if (user.value) {
    await navigateTo('/goals')
  }
})

const handleSignOut = async () => {
  try {
    await signOut()
  } catch (e) {
    // Error handled in composable
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
h1 {
  text-align: center;
  margin-bottom: 2rem;
}
.error {
  color: red;
  text-align: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #fee;
  border-radius: 4px;
}
button {
  padding: 0.5rem 1rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 1rem;
}
</style>
