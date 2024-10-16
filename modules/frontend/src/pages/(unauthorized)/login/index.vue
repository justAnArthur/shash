<script lang="ts" setup>
import { reactive } from 'vue';
const form = reactive({
  email: '',
  password: ''
})

const onSubmit = () => {
  console.log(form)
  console.log('submitted')
}
</script>

<template>
    <span class="title">Sign in to Slash</span>
    <input class="q-input" type="email" v-model="form.email" placeholder="Email" />
    <input class="q-input" type="password" v-model="form.password" placeholder="Password" />
    <button class="q-btn" @click="onSubmit">Sign in</button>
    <div class="footer-text">Don't have an account? <a href="#/auth/register">Sign up</a></div>
</template>

<style scoped>
  .title {
    margin-bottom: 40px;
    text-align: center;
    font-size: 32px;
    line-height: 1;
    font-weight: 500;
  }
  .q-input{
    margin-bottom: 20px;
    height: 52px;
    padding: 0 18px;
    width: 100%;
    background: hsla(0, 0%, 97%, .05);
    border-radius: 12px;
    border: 1.5px solid transparent;
    font-size: 14px;
    line-height: 1.4;
    color: hsla(0, 0%, 97%, .76);
    transition: all .2s;
  }
  .q-btn {
    width: 100%;
  }
  .footer-text {
    margin-top: 40px;
    text-align: center;
    color: hsla(0, 0%, 97%, .76);
  }
</style>
