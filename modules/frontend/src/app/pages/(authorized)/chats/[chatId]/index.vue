<template>
  <main class="chat">
    <chat-head
      v-if="chat"
      :chat="chat"
    />

    <div class="messages-container" ref="chatContainer" @scroll="onScroll">
      <div v-if="isLoading" class="loading">Loading...</div>
      <chat-message
        v-for="message in messages"
        :key="message.id"
        :username="message.username"
        :created-at="new Date(message.createdAt)"
        :content="message.content"
      />
    </div>

    <command-line
      v-if="chat"
      :chat="chat"
      :sendMessage="sendMessage"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { io, Socket } from "socket.io-client";
import { api } from "boot/axios";
import { useAuth } from 'src/lib/composables/useAuth';
import CommandLine from 'src/app/components/command-line.vue';
import ChatMessage from "src/app/pages/(authorized)/chat-message.vue";
import ChatHead from "src/app/pages/(authorized)/chat-head.vue";

const socket = ref<Socket | null>(null);
socket.value = io('http://localhost:3333'); // replace with your server URL

const route = useRoute();
const chat = ref<any>();
const page = ref<number>(1);
const totalPages = ref<number>(1);
const messages = ref<any[]>([]);
const isLoading = ref(false);
const chatContainer = ref<HTMLElement | null>(null);
const { user } = useAuth();
const isInitialLoad = ref(true);

async function fetchChat(id: string) {
  chat.value = await api.get(`/chat/byId/${id}`).then(({ data }) => data);
  socket.value?.emit('join:room', chat.value.id);
}

async function fetchMessages(id: string) {
  if (isLoading.value || page.value > totalPages.value) return;

  isLoading.value = true;
  const currentScrollHeight = chatContainer.value?.scrollHeight || 0;
  const currentScrollTop = chatContainer.value?.scrollTop || 0;

  try {
    const response = await api.get(`/message/byChat/${id}?page=${page.value}`);
    const data = response.data;
    messages.value.unshift(...data.data.reverse())
    totalPages.value = data.meta.lastPage;
    page.value += 1;

    await nextTick();

    if (chatContainer.value) {
      const newScrollHeight = chatContainer.value.scrollHeight;
      if (isInitialLoad.value) {
        chatContainer.value.scrollTop = newScrollHeight;
        isInitialLoad.value = false;
      } else {
        chatContainer.value.scrollTop = currentScrollTop + (newScrollHeight - currentScrollHeight);
      }
    }
  } catch (error) {
    console.error('Failed to fetch messages:', error);
  } finally {
    isLoading.value = false;
  }
}

function onScroll() {
  if (!chatContainer.value) return;

  const { scrollTop, scrollHeight, clientHeight } = chatContainer.value;

  // Load more when user is within 20% of the top of the chat
  if (scrollTop <= clientHeight * 0.2 && !isLoading.value) {
    fetchMessages(route.params.chatId as string);
  }
}

watch(() => route.params.chatId, (chatId) => {
  if (chatId) {
    chat.value = undefined;
    messages.value = [];
    page.value = 1;
    totalPages.value = 1;
    isInitialLoad.value = true;
    fetchChat(chatId as string);
    fetchMessages(chatId as string);
  }
}, { immediate: true });

function sendMessage(content: string) {
  if (socket.value && chat.value) {
    const message = {
      chatId: chat.value.id,
      content,
    };
    api.post('/message/send', message)
      .then((response) => {
        console.log('Message sent:', response.data);
        scrollToBottom();
      })
      .catch((error) => {
        console.error('Failed to send message:', error);
      });
  }
}

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
}

onMounted(() => {
  if (socket.value) {
    socket.value.on('chat:message', (incomingMessage) => {
      if (incomingMessage.chatId === chat.value?.id) {
        messages.value.push(incomingMessage); // Add new messages to the end
        nextTick(() => {
          if (chatContainer.value &&
              chatContainer.value.scrollHeight - chatContainer.value.scrollTop <= chatContainer.value.clientHeight + 100) {
            scrollToBottom();
          }
        });
      }
    });
  }
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.off('chat:message');
  }
});
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

.messages-container::-webkit-scrollbar {
  display: none;
}

.loading {
  text-align: center;
  padding: 1rem;
  color: #888;
}
</style>
