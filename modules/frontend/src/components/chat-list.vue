<template>
  <div class="chat-list-header">
    <h2 class="chat-list-title">Chat list</h2>
    <div class="q-btn" @click="toggleFormVisible">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="lucide lucide-plus">
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
    </div>
  </div>
  <create-chat-form v-if="isFormVisible" id="chat-create-form" />
  <ul id="chat-list">
    <li class="chat-item" v-for="chat in chats" :key="chat.id" @click="goToChat(chat.id)">
      <chat-list-item :chatName="chat.channelName" :lastMessage="chat.lastMessage" />
    </li>
    <li class="chat-item" @click="goToChat(testChat.id)">
      <chat-list-item :chatName="testChat.channelName" :lastMessage="testChat.lastMessage" />
    </li>
  </ul>
</template>

<script setup>

const testChat = {
  id: 1,
  channelName: 'Test chat',
  lastMessage: {
    text: 'Lorem ipsum dolor I dont know how long I need',
    time: Date.now() - 25 * 60 * 60 * 1000,
    author: 'Test user'
  }

}
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ChatListItem from 'src/components/chat-list-item.vue'
import CreateChatForm from 'src/components/create-chat-form.vue'

const router = useRouter()
const chats = ref([]);

const isFormVisible = ref(false);
const toggleFormVisible = () => {
  isFormVisible.value = !isFormVisible.value
}
const goToChat = (chatId) => {
  router.push("/")
}
const createChat = () => {

}

</script>
<style>
.chat-item {
  position: relative;
  display: flex;
  flex-grow: 1;
  gap: 1rem;
  height: fit-content;
  padding: 12px 24px 12px 12px;
  border-radius: 20px;
  background: var(--color-20);
  transition: background-color;
  cursor: pointer;
}

.chat-item:after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 20px;
  pointer-events: none;
  border: 1px solid hsla(0, 0%, 100%, .1);
  -webkit-mask-image: linear-gradient(175deg, #000, transparent 55%);
  mask-image: linear-gradient(175deg, #000, transparent 55%);
  opacity: 0;
  transition: opacity .2s;
}

.chat-item:hover:after {
  opacity: 1;
}

.chat-item:hover .three-dots,
.three-dots.menu-visible {
  opacity: 1;
}

.chat-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-list-title {
  padding-left: 1rem;
  font-weight: 600;
  line-height: 1;
  font-size: 24px;
}

@media only screen and (max-width: 1024px) {
  #chat-create-form {
    margin: 0;
    margin-left: auto;
  }
}
</style>
