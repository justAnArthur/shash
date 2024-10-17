<template>
  <command-line />

  <div class="chat-message">
    <img src="https://xsgames.co/randomusers/avatar.php?g=male" alt="">
    <div style="display: grid; gap: 0.5rem">
      <div style="display: flex; gap: 0.5rem; align-items: center">
        <h2 style="font-weight: 600; line-height: 1; font-size: 16px">Arthur</h2>
        <div style="color: hsla(0, 0%, 97%, .25); line-height: 1;">09:22 AM</div>
      </div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
        ea commodo consequat.
      </p>
    </div>
  </div>

  <div class="chat-message">
    <img src="https://xsgames.co/randomusers/avatar.php?g=female" alt="">
    <div style="display: grid; gap: 0.5rem">
      <div style="display: flex; gap: 0.5rem; align-items: center">
        <h2 style="font-weight: 600; line-height: 1; font-size: 16px">Anastasiia</h2>
        <div style="color: hsla(0, 0%, 97%, .25); line-height: 1;">03:42 PM</div>
      </div>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    </div>
  </div>

  <header id="chat-header">
    <img src="https://xsgames.co/randomusers/avatar.php?g=pixel" alt="">

    <h1 style="flex: 1 1 0">Quasar is shit & Vue too</h1>

    <button class="q-btn" style="aspect-ratio: 1/1">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="lucide lucide-ellipsis">
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
    </button>
  </header>
</template>

<style scoped>
.chat-message {
  display: flex;
  gap: 1rem;

  padding: 1rem;
  border-radius: 20px;

  background: hsla(0, 0%, 97%, .05);

  color: hsla(0, 0%, 97%, .56);
}

#chat-header {
  padding-left: 1rem;
  padding-right: 1rem;

  display: flex;
  gap: 1rem;
  align-items: center;

  margin-bottom: auto;
}

#chat-header h1 {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.5rem;
}

#chat-header img {
  border-radius: 999px;
  min-width: 3rem;
  min-height: 3rem;
  max-width: 3rem;
  max-height: 3rem;
  aspect-ratio: 1/1;
}
</style>

<script lang="ts" setup>
import CommandLine from 'components/command-line.vue';
</script>
