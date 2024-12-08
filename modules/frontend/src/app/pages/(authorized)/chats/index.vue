<template>
  <div class="chat">
    <chat-list/>
  </div>

  <command-line/>
</template>

<script setup>
import ChatList from 'src/app/components/chat-list.vue'
import CommandLine from 'src/app/components/chat-list.vue'
</script>
<style scoped>

.chat {
  display: flex;
  flex-direction: column;
  height: 98vh;
}

.messages-container {
  margin: 1rem 0;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
