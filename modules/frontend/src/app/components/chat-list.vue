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

  <create-chat-form v-if="isFormVisible" :onSubmit="toggleFormVisible" id="chat-create-form"/>

  <ul id="chat-list">
    <li v-for="chat in invitesChat" :key="chat.id" class="chat-item highlighted">
      <chat-list-item :chatName="chat.channelName" :invited="true" :is-private="chat.isPrivate"
                      :accept-invite="() =>acceptChatInvite(chat.id)" :reject-invite="() =>rejectChatInvite(chat.id)"/>
    </li>

    <li v-for="chat in chatsMine" :key="chat.id" class="chat-item" @click="openChat(chat.id)">
      <chat-list-item :chatName="chat.channelName" :lastMessage="chat.lastMessage" :is-private="chat.isPrivate"
                      :chatId="chat.id"/>
    </li>

    <li v-if="!chatsMine || chatsMine.length === 0">No participating in chats</li>
  </ul>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import CreateChatForm from "src/app/components/create-chat-form.vue"
import ChatListItem from "src/app/components/chat-list-item.vue"
import { chatsMine, updateChatMine } from "src/app/components/chat-list.store"
import { api } from "boot/axios"


const isFormVisible = ref(false)
const invitesChat = ref<any[]>([])


const router = useRouter()


const toggleFormVisible = () => {
  isFormVisible.value = !isFormVisible.value
}
let updateInterval



onMounted(() => {
  updateChatMine()
  updateInterval = setInterval(() => {
    api.get("/chat/invites").then(({ data }) => {
      invitesChat.value = data
    })
  }, 10000)
  api.get("/chat/invites").then(({ data }) => {
    invitesChat.value = data
  })
})

onBeforeUnmount(() => {
  clearInterval(updateInterval)
})

const openChat = (chatId: string) => {
  router.push("/chats/" + chatId)
}


const acceptChatInvite = async (chatId: string) => {
  await api.post("/chat/invite/accept/" + chatId)
  invitesChat.value = invitesChat.value.filter((chat) => chat.id !== chatId)
  updateChatMine()
}


const rejectChatInvite = async (chatId: string) => {
  await api.delete("/chat/invite/reject/" + chatId)
  invitesChat.value = invitesChat.value.filter((chat) => chat.id !== chatId)
}
</script>

<style>
.highlighted {
  background-color: hsla(200, 100%, 60%, 0.5);
  border: 4px solid hsla(200, 100%, 60%, 1);
}

.chat-item {
  margin: 3px 0;
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

  mask-image: linear-gradient(175deg, #000, transparent 55%);
  opacity: 0;
  transition: opacity .2s;
}

.chat-item:hover:after {
  opacity: 1;
}

.chat-item:hover {
  opacity: 1;
}

#chat-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

#chat-list::-webkit-scrollbar {
  display: none;
}

.chat-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
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

  .chat-list-header {
    margin-top: 2rem;
  }
}
</style>
