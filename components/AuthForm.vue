<template>
  <div class="auth-form">
    <div class="tabs">
      <button @click="mode = 'password'" :class="{ active: mode === 'password' }">Password</button>
      <button @click="mode = 'magic'" :class="{ active: mode === 'magic' }">Magic Link</button>
    </div>

    <form @submit.prevent="handleSubmit">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-if="mode === 'password'" v-model="password" type="password" placeholder="Password" required />
      <label v-if="mode === 'password' && !isSignUp" class="remember-me">
        <input v-model="rememberMe" type="checkbox" />
        记住我（30天）
      </label>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Loading...' : mode === 'password' ? 'Sign In' : 'Send Magic Link' }}
      </button>
    </form>

    <button v-if="mode === 'password'" @click="isSignUp = !isSignUp" class="toggle">
      {{ isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up' }}
    </button>

    <p v-if="message" class="message">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const { signIn, signInWithPassword, signUp } = useAuth()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const message = ref('')
const error = ref('')
const mode = ref<'password' | 'magic'>('magic')
const isSignUp = ref(false)
const lastRequestTime = ref(0)

const handleSubmit = async () => {
  loading.value = true
  message.value = ''
  error.value = ''

  try {
    if (mode.value === 'password') {
      if (isSignUp.value) {
        await signUp(email.value, password.value)
        message.value = 'Account created! Check your email to verify.'
      } else {
        await signInWithPassword(email.value, password.value, rememberMe.value)
        await navigateTo('/goals')
      }
    } else {
      const now = Date.now()
      if ((now - lastRequestTime.value) / 1000 < 60) {
        error.value = `Please wait ${Math.ceil(60 - (now - lastRequestTime.value) / 1000)} seconds`
        return
      }
      await signIn(email.value)
      lastRequestTime.value = now
      message.value = 'Check your email for the magic link!'
    }
    email.value = ''
    password.value = ''
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Authentication failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.tabs button {
  flex: 1;
  padding: 0.5rem;
  background: #f5f5f5;
  border: 1px solid #ddd;
  cursor: pointer;
}
.tabs button.active {
  background: #0070f3;
  color: white;
}
input {
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}
button[type="submit"] {
  width: 100%;
  padding: 0.5rem;
  background: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
}
button[type="submit"]:disabled {
  opacity: 0.5;
}
.toggle {
  width: 100%;
  padding: 0.5rem;
  background: transparent;
  color: #0070f3;
  border: none;
  cursor: pointer;
  margin-top: 0.5rem;
  text-decoration: underline;
}
.message {
  color: green;
  margin-top: 1rem;
}
.error {
  color: red;
  margin-top: 1rem;
}
.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
  font-size: 0.9rem;
}
.remember-me input[type="checkbox"] {
  width: auto;
  margin: 0;
}
</style>
