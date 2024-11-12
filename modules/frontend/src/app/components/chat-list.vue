<template>
  <div class="chat-list-header">
    <h2 class="chat-list-title">Chat list</h2>
    <div class="q-btn" @click="toggleFormVisible">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
           class="lucide lucide-plus">
        <path d="M5 12h14"/>
        <path d="M12 5v14"/>
      </svg>
    </div>
  </div>

  <create-chat-form v-if="isFormVisible" id="chat-create-form"/>

  <ul id="chat-list">
    <li v-for="chat in chatsMine" :key="chat.id" class="chat-item" @click="openChat(chat.id)">
      <chat-list-item :chatName="chat.channelName" :lastMessage="chat.lastMessage"/>
    </li>

    <li v-if="!chatsMine || chatsMine.length === 0">No chats available</li>
  </ul>
</template>

<script lang="ts">
import  CreateChatForm from "src/app/components/create-chat-form.vue"
import { onMounted, ref } from "vue"
import { chatsMine, updateChatMine } from "src/app/components/chat-list.store"
import ChatListItem from "src/app/components/chat-list-item.vue"
import { useRouter } from "vue-router"

export default {
  components: { ChatListItem, CreateChatForm },
  setup() {
    const isFormVisible = ref(false)

    const toggleFormVisible = () => {
      isFormVisible.value = !isFormVisible.value
    }

    // ---

    const router = useRouter()

    onMounted(() => updateChatMine())

    function openChat(chatId: string) {
      router.push("/chats/" + chatId)
    }

    return { chatsMine, openChat, isFormVisible, toggleFormVisible }
  }
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
  //-webkit-mask-image: linear-gradient(175deg, #000, transparent 55%);
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
