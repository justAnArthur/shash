<template>
  <main class="chat">
    <command-line/>

    <chat-message
      :user="{name: 'Artem'}"
      :created-at="new Date('2021-09-01T15:42:00')"
      :content="`Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`"
    />

    <chat-message
      :user="{name: 'Artur '}"
      :created-at="new Date('2021-09-01T15:42:00')"
      :content="`Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`"
    />

    <chat-head
      :channel-name="`Quasar is 💩 & Vue too`"
    />
  </main>
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

.chat {
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  gap: 1rem;
}
</style>

<script lang="ts" setup>
import CommandLine from 'components/command-line.vue'
import ChatMessage from "pages/(authorized)/chat-message.vue"
import ChatHead from "pages/(authorized)/chat-head.vue"
// TODO: refactor mobile view chat header styles
</script>
