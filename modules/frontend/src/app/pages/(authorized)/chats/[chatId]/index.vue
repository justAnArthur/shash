<template>
  <main class="chat">
    <command-line
      v-if="chat"
      :chat="chat"
      :sendMessage="sendMessage"
    />

    <chat-message
      v-for="message in messages"
      :key="message.id"
      :username="message.username"
      :created-at="new Date(message.createdAt)"
      :content="message.content"
    />

    <chat-head
      v-if="chat"
      :chat="chat"
    />
  </main>
</template>

<script setup lang="ts">
import CommandLine from 'src/app/components/command-line.vue'
import ChatMessage from "src/app/pages/(authorized)/chat-message.vue"
import ChatHead from "src/app/pages/(authorized)/chat-head.vue"
import { ref, watch, onMounted, onUnmounted } from "vue"
import { api } from "boot/axios"
import { useRoute } from "vue-router"
import { io, Socket } from "socket.io-client"
import { useAuth } from 'src/lib/composables/useAuth'

// Initialize socket connection
const socket = ref<Socket | null>(null)
socket.value = io('http://localhost:3333') // replace with your server URL

const route = useRoute()
const chat = ref<any>()
const messages = ref<any[]>([])
const { user } = useAuth()
async function fetchChat(id: string) {
  chat.value = await api.get(`/chat/byId/${id}`).then(({ data }) => data)
  socket.value.emit('join:room', chat.value.id);
}

async function fetchMessages(id: string) {
  messages.value = await api.get(`/message/byChat/${id}`).then(({ data }) => data)
}

watch(() => route.params.chatId, (chatId) => {
  if (chatId) {
    fetchChat(chatId as string)
    fetchMessages(chatId as string)
  } else {
    chat.value = undefined
    messages.value = []
  }
}, { immediate: true })

function sendMessage(content: string) {
  if (socket.value && chat.value) {
    const message = {
      chatId: chat.value.id,
      content,
    }
    api.post('/message/send', message)
          .then((response) => {
            console.log('Message sent:', response.data)
          })
          .catch((error) => {
            console.error('Failed to send message:', error)
          })
      }
}
onMounted(() => {
  if (socket.value) {
    socket.value.on('chat:message', (incomingMessage) => {
      if (incomingMessage.chatId === chat.value?.id) {
        messages.value.unshift(incomingMessage)
      }
    })
  }
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.off('chat:message')
  }
})
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
