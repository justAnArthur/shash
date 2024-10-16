<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { validateLogin } from 'src/utils/validators';
const form = reactive({
  email: '',
  password: ''
})
const errors = reactive({
  email: '',
  password: '',
  global: ''
})
const onSubmit = () => {
  const validationErrors = validateLogin({ ...form })
  Object.keys(errors).forEach((key) => {
    errors[key] = validationErrors[key] || '';
  });
  if (Object.values(errors).some(error => error !== '')) {
    return
  }
  setTimeout(() => {
    window.location.href = '#/'
  }, 1000)
}
</script>

<template>
  <span class="auth-title">Sign in to Slash</span>
  <div class="input-wrapper">
    <input class="q-input" type="email" required v-model="form.email" placeholder="Email" />
    <div class="auth-error-message" v-if="errors.email">{{ errors.email }}</div>
  </div>
  <div class="input-wrapper">
    <input class="q-input" type="password" required v-model="form.password" placeholder="Password" />
    <div class="auth-error-message" v-if="errors.password">{{ errors.password }}</div>
  </div>
  <button class="q-btn" type="button" @click="onSubmit">Sign in</button>
  <div class="auth-error-message" v-if="errors.global">{{ errors.global }}</div>
  <div class="auth-footer-text">Don't have an account? <a href="#/auth/register">Sign up</a></div>
</template>

<style scoped>
.q-btn {
  width: 100%;
}
</style>
