<template>
  <ul id="chat-list">
    <li class="chat-item" v-for="chat in chats" :key="chat.id">
      <chat-list-item :chatName="chat.channelName" :lastMessage="chat.lastMessage" />
    </li>
    <li class="chat-item">
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
import ChatListItem from 'src/components/chat-list-item.vue'
const chats = ref([]);

</script>
<style scoped>
.chat-item {
  position: relative;

  display: flex;
  gap: 1rem;

  height: fit-content;

  padding: 12px 36px 12px 12px;
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
</style>
