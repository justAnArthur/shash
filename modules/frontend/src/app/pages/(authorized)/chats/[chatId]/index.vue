<template>
  <main class="chat">
    <command-line v-if="chatId"/>

    <chat-message
      v-for="message in messages"
      :key="message.id"
      :user="message.user"
      :created-at="new Date(message.createdAt)"
      :content="message.content"
    />

    <chat-head
      v-if="chatId"
      :channel-name="`Quasar is !best`"
    />
  </main>
</template>

<script lang="ts">
import CommandLine from 'src/app/components/command-line.vue'
import ChatMessage from "src/app/pages/(authorized)/chat-message.vue"
import ChatHead from "src/app/pages/(authorized)/chat-head.vue"

import { ref, watch } from "vue"
import { api } from "boot/axios"
import { useRoute } from "vue-router"

export default {
  components: { CommandLine, ChatHead, ChatMessage },
  setup() {
    const messages = ref<any[]>([])
    const chatId = ref<undefined | string>()
    const route = useRoute()

    const fetchMessages = async (id: string) => {
      messages.value = await api.get(`/message/byChat/${id}`).then(({ data }) => data)
    }

    watch(chatId, (newId) => {
      if (newId) {
        fetchMessages(newId)
      }
    })

    watch(() => route.params.chatId, (newChatId) => {
      if (newChatId) {
        chatId.value = newChatId as string
        fetchMessages(chatId.value)
      }
    }, { immediate: true })

    return { messages, chatId }
  }
}
</script>

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
