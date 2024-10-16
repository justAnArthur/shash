<script lang="ts" setup>
import { reactive, ref } from 'vue';
const form = reactive({
  email: '',
  username: '',
  fullname: '',
  password: ''
})
const errorMessage = ref('')
const onSubmit = () => {
  console.log(form)
}
</script>

<template>
  <span class="auth-title">Sign up to Slash</span>
  <input class="q-input" type="email" required v-model="form.email" placeholder="Email" />
  <input class="q-input" type="text" required v-model="form.username" placeholder="Username" />
  <input class="q-input" type="text" required v-model="form.fullname" placeholder="Full name" />
  <input class="q-input" type="password" required v-model="form.password" placeholder="Password" />
  <button class="q-btn" type="button" @click="onSubmit">Sign up</button>
  <div class="auth-error-message" v-if="errorMessage">{{ errorMessage }}</div>
  <div class="auth-footer-text">Already have an account? <a href="#/auth/login">Sign in</a></div>
</template>

<style scoped>
.q-btn {
  width: 100%;
}
</style>
