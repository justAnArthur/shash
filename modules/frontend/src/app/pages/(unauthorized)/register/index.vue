<script lang="ts" setup>
import { useAuth } from 'src/lib/composables/useAuth'
import { reactive } from 'vue'
import { validateRegistration } from 'src/utils/validators'

const form = reactive({
  email: '',
  nickname: '',
  surname: '',
  name: '',
  password: ''
})
const errors = reactive({
  email: '',
  nickname: '',
  surname: '',
  name: '',
  password: '',
  global: ''
})
const { register } = useAuth()
const onSubmit = async () => {
  const validationErrors = validateRegistration({ ...form })
  Object.keys(errors).forEach((key) => {
    errors[key] = validationErrors[key] || ''
  })
  if (Object.values(errors).some(error => error !== '')) {
    return
  }
  try {
    errors.global = ''
    const success = await register({ ...form })
    if (success) {
      errors.global = 'Registered successfully'
    } else {
      errors.global = 'Registeration failed'
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <span class="auth-title">Sign up to Slash</span>
  <div class="input-wrapper">
    <input class="q-input" type="email" required v-model="form.email" placeholder="Email"/>
    <div class="auth-error-message" v-if="errors.email">{{ errors.email }}</div>
  </div>
  <div class="input-wrapper">
    <input class="q-input" type="text" required v-model="form.nickname" placeholder="Username"/>
    <div class="auth-error-message" v-if="errors.nickname">{{ errors.nickname }}</div>
  </div>
  <div class="input-wrapper">
    <input class="q-input" type="text" required v-model="form.name" placeholder="Name"/>
    <div class="auth-error-message" v-if="errors.name">{{ errors.name }}</div>
  </div>
  <div class="input-wrapper">
    <input class="q-input" type="text" required v-model="form.surname" placeholder="Surname"/>
    <div class="auth-error-message" v-if="errors.surname">{{ errors.surname }}</div>
  </div>
  <div class="input-wrapper">
    <input class="q-input" type="password" required v-model="form.password" placeholder="Password"/>
    <div class="auth-error-message" v-if="errors.password">{{ errors.password }}</div>
  </div>
  <button class="q-btn" type="button" @click="onSubmit">Sign up</button>
  <div class="auth-error-message" v-if="errors.global">{{ errors.global }}</div>
  <div class="auth-footer-text">Already have an account? <a href="#/login">Sign in</a></div>
</template>

<style scoped>
.q-btn {
  width: 100%;
}
</style>
