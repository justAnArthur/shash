<script lang="ts" setup>
import { reactive } from 'vue'
import { validateLogin } from 'src/utils/validators'
import { useAuth } from 'src/lib/composables/useAuth'
import { useRouter } from 'vue-router'

const form = reactive({
  email: '',
  password: ''
})
const errors = reactive({
  email: '',
  password: '',
  global: ''
})
const router = useRouter()
const { login } = useAuth()
const onSubmit = async () => {
  const validationErrors = validateLogin({ ...form })
  Object.keys(errors).forEach((key) => {
    errors[key] = validationErrors[key] || ''
  })
  if (Object.values(errors).some(error => error !== '')) {
    return
  }
  try {
    errors.global = ''
    const success = await login({ ...form })
    if (success) {
      errors.global = 'Logged In'
    } else {
      errors.global = 'Invalid email or password'
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <span class="auth-title">Sign in to Slash</span>
  <div class="input-wrapper">
    <input autocomplete="email" class="q-input" type="email" required v-model="form.email" placeholder="Email"/>
    <div class="auth-error-message" v-if="errors.email">{{ errors.email }}</div>
  </div>
  <div class="input-wrapper">
    <input autocomplete="current-password" class="q-input" type="password" required v-model="form.password"
           placeholder="Password"/>
    <div class="auth-error-message" v-if="errors.password">{{ errors.password }}</div>
  </div>
  <button class="q-btn" type="button" @click="onSubmit">Sign in</button>
  <div class="auth-error-message" v-if="errors.global">{{ errors.global }}</div>
  <div class="auth-footer-text">Don't have an account? <a href="#/register">Sign up</a></div>

</template>

<style scoped>
.q-btn {
  width: 100%;
}
</style>
