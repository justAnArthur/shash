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
      <div v-for="typing in typingMessages" :key="typing.username" class="typing-indicator" @click="showTypingContent(typing)">
        {{ typing.username }} is typing...
      </div>
    </div>

    <command-line
      v-if="chat"
      :chat="chat"
      :sendMessage="sendMessage"
      :typingMessage="debouncedTyping"
    />
<div v-if="showModal" class="modal-overlay" @click="closeModal">
  <div class="modal-content" @click.stop>
    <div class="modal-header">
      <h3>{{ modalContent.username }}'s Typing</h3>
    </div>
    <div class="modal-body">
      <p>"{{ modalContent.content }}"</p>
    </div>
    <div class="modal-footer">
      <button @click="closeModal" class="close-btn">Close</button>
    </div>
  </div>
</div>
  </main>
</template>

<script setup lang="ts">
import { debounce } from 'quasar';
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { io, Socket } from "socket.io-client";
import { api } from "boot/axios";
import { useAuth } from 'src/lib/composables/useAuth';
import CommandLine from 'src/app/components/command-line.vue';
import ChatMessage from "src/app/components/chat-message.vue";
import ChatHead from "src/app/components/chat-head.vue";

const socket = ref<Socket | null>(null);
socket.value = io('http://localhost:3333'); // replace with your server URL

const route = useRoute();
const chat = ref<any>();
const page = ref<number>(1);
const totalPages = ref<number>(1);
const messages = ref<any[]>([]);
const typingMessages = ref<any[]>([]);
const isLoading = ref(false);
const chatContainer = ref<HTMLElement | null>(null);
const { user } = useAuth();
const isInitialLoad = ref(true);
const showModal = ref(false);
const modalContent = ref({ username: '', content: '' });

function showTypingContent(typingMessage: any) {
  modalContent.value = { username: typingMessage.username, content: typingMessage.content };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}
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

function typingMessage(content: string) {
  if(socket.value && chat.value) {
    const message = {
      chatId: chat.value.id,
      content,
      username: user.value.nickname
    };
    socket.value.emit('chat:typing', message);
  }
}
const debouncedTyping = debounce(typingMessage, 100);
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
        typingMessages.value = typingMessages.value.filter(
          (msg) => msg.username !== incomingMessage.username
        );
        nextTick(() => {
          if (chatContainer.value &&
              chatContainer.value.scrollHeight - chatContainer.value.scrollTop <= chatContainer.value.clientHeight + 100) {
            scrollToBottom();
          }
        });
      }
    });
socket.value.on('chat:typing', (incomingMessage) => {
  if (incomingMessage.chatId === chat.value?.id) {
    const existingTypingIndex = typingMessages.value.findIndex(
      (msg) => msg.username === incomingMessage.username
    );

    if (existingTypingIndex !== -1) {
      // Update existing typing message
      typingMessages.value[existingTypingIndex].content = incomingMessage.content;
    } else {
      // Add new typing message
      typingMessages.value.push(incomingMessage);

      // Remove the typing indicator after 10 seconds if no further updates
      setTimeout(() => {
        typingMessages.value = typingMessages.value.filter(
          (msg) => msg.username !== incomingMessage.username
        );
      }, 10000);
    }
    if (chatContainer.value &&
        chatContainer.value.scrollHeight - chatContainer.value.scrollTop <= chatContainer.value.clientHeight + 100) {
        scrollToBottom();
    }
  }
});
  }
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.off('chat:message');
    socket.value.off('chat:typing');
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

.typing-indicator {
  font-style: italic;
  color: gray;
  padding-left: 1rem;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal Content */
.modal-content {
  background-color: #22272e; /* Match the site's dark background */
  color: #fff; /* Light text */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 400px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Header Section */
.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #ffffff;
}

/* Body Section */
.modal-body p {
  font-size: 1rem;
  color: #c3c3c3; /* Softer text color */
  margin: 0;
}

/* Footer Section */
.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.close-btn {
  background-color: #444c56; /* Subtle dark button */
  color: #ffffff;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background-color: #57606a; /* Slightly lighter on hover */
}
</style>
