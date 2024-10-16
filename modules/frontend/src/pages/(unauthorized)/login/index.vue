<script lang="ts" setup>
import { reactive, ref } from 'vue';
const form = reactive({
  email: '',
  password: ''
})
const errorMessage = ref('')
const onSubmit = () => {
  console.log(form)
}
</script>

<template>
  <span class="auth-title">Sign in to Slash</span>
  <input class="q-input" type="email" required v-model="form.email" placeholder="Email" />
  <input class="q-input" type="password" required v-model="form.password" placeholder="Password" />
  <button class="q-btn" type="button" @click="onSubmit">Sign in</button>
  <div class="auth-error-message" v-if="errorMessage">{{ errorMessage }}</div>
  <div class="auth-footer-text">Don't have an account? <a href="#/auth/register">Sign up</a></div>
</template>

<style scoped>
.q-btn {
  width: 100%;
}
</style>
