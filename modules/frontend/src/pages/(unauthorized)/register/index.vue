<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { validateRegistration } from 'src/utils/validators';
const form = reactive({
  email: '',
  username: '',
  fullname: '',
  password: ''
})
const errors = reactive({
  email: '',
  username: '',
  fullname: '',
  password: '',
  global: ''
})
const onSubmit = () => {
  const validationErrors = validateRegistration({ ...form })
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
  <span class="auth-title">Sign up to Slash</span>
  <div class="input-wrapper">
    <input class="q-input" type="email" required v-model="form.email" placeholder="Email" />
    <div class="auth-error-message" v-if="errors.email">{{ errors.email }}</div>
  </div>
  <div class="input-wrapper">
    <input class="q-input" type="text" required v-model="form.username" placeholder="Username" />
    <div class="auth-error-message" v-if="errors.username">{{ errors.username }}</div>
  </div>
  <div class="input-wrapper">
    <input class="q-input" type="text" required v-model="form.fullname" placeholder="Full name" />
    <div class="auth-error-message" v-if="errors.fullname">{{ errors.fullname }}</div>
  </div>
  <div class="input-wrapper">
    <input class="q-input" type="password" required v-model="form.password" placeholder="Password" />
    <div class="auth-error-message" v-if="errors.password">{{ errors.password }}</div>
  </div>
  <button class="q-btn" type="button" @click="onSubmit">Sign up</button>
  <div class="auth-error-message" v-if="errors.global">{{ errors.global }}</div>
  <div class="auth-footer-text">Already have an account? <a href="#/auth/login">Sign in</a></div>
</template>

<style scoped>
.q-btn {
  width: 100%;
}
</style>
