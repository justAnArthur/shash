<template>
  <img class="avatar" :src="`https://picsum.photos/seed/${props.chatName}/200/200`" :alt="props.chatName">
  <div style="display: grid; gap: 0.25rem; width:100%;">
    <div style="display:flex; gap: 0.5rem; align-items: center; justify-content: space-between">
      <div class="chat-info">
        <div style="display: flex; gap: 0.25rem; align-items: center">
          <svg v-if="props.isPrivate" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               class="lucide lucide-lock">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>

          <h2 class="chat-name">{{ props.chatName }}</h2>
          <div class="message-dot"/>

          <svg v-if="props.invited" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               class="lucide lucide-party-popper">
            <path d="M5.8 11.3 2 22l10.7-3.79"/>
            <path d="M4 3h.01"/>
            <path d="M22 8h.01"/>
            <path d="M15 2h.01"/>
            <path d="M22 20h.01"/>
            <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/>
            <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"/>
            <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/>
            <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/>
          </svg>
        </div>
        <p class="message-time">{{ timeDisplay }}</p>
      </div>

      <div v-if="props.invited" @click="props.rejectInvite">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             class="lucide lucide-square-x">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <path d="m15 9-6 6"/>
          <path d="m9 9 6 6"/>
        </svg>
      </div>
      <div v-if="props.invited" @click="props.acceptInvite">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
             stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check">
          <path d="M20 6 9 17l-5-5"/>
        </svg>
      </div>
    </div>

    <div class="last-message" v-if="props.lastMessage">
      <p class="message-author">{{ props.lastMessage.user.nickname }}</p>
      <p class="message-text">
        {{ props.lastMessage.content }}
      </p>
    </div>
  </div>

  <div v-if="!props.invited" @click="deleteOrQuit">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-x">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
      <path d="m15 9-6 6"/>
      <path d="m9 9 6 6"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onBeforeUnmount, onMounted, ref } from 'vue'
import { IMessage } from "src/app/components/models"
import { updateChatMine } from "src/app/components/chat-list.store"
import { api } from "boot/axios"

const props = defineProps<{
  chatName: string,
  lastMessage?: IMessage,
  isPrivate?: boolean,
  invited?: boolean
  chatId?: string,
  acceptInvite?: Function,
  rejectInvite?: Function
}>()
const deleteOrQuit = async (ev) => {
  ev.stopPropagation();
  await api.delete(`/chat/${props.chatId}?quit=false`)
  await updateChatMine()
}
const timeDisplay = ref('')
const menuVisible = ref(false)

const toggleMenu = () => {
  menuVisible.value = !menuVisible.value
}

const onMenuItemClick = (action) => {
  console.log(`${action} clicked!`)
  // Handle menu action (like navigation, etc.)
  menuVisible.value = false  // Close the menu after an action
}

let intervalId: ReturnType<typeof setInterval>

const setNextUpdate = (nextInterval: number) => {
  clearInterval(intervalId)
  intervalId = setInterval(updateTime, nextInterval)
}

onMounted(() => {
  updateTime()
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})

const updateTime = () => {
  // Chat won't open without this line
  if (!props.lastMessage)
    return

  const time = Date.now() - new Date(props.lastMessage.createdAt).getTime()

  if (time < 60 * 1000) {
    setNextUpdate(60 * 1000)
    timeDisplay.value = "Now"
  } else if (time < 60 * 60 * 1000) {
    setNextUpdate(60 * 1000)
    timeDisplay.value = `${Math.floor(time / (60 * 1000))}m`
  } else if (time < 24 * 60 * 60 * 1000) {
    setNextUpdate(60 * 60 * 1000)
    timeDisplay.value = `${Math.floor(time / (60 * 60 * 1000))}h`
  } else if (time < 365 * 24 * 60 * 60 * 1000) {
    clearInterval(intervalId)
    timeDisplay.value = new Date(props.lastMessage.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })
  } else {
    clearInterval(intervalId)
    timeDisplay.value = new Date(props.lastMessage.createdAt).toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }
}

</script>
<style scoped>
.q-btn {
  width: 2rem;
}

.chat-message img {
  border-radius: 999px;
  min-width: 3rem;
  min-height: 3rem;
  max-width: 3rem;
  max-height: 3rem;
  aspect-ratio: 1/1;
}

.message-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: hsla(0, 0%, 97%, .56);
}

.message-time {
  color: hsla(0, 0%, 97%, .25);
  line-height: 1;
}

.chat-name {
  font-weight: 600;
  line-height: 1;
  font-size: 16px
}

.three-dots {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.chat-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem
}

.message-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background-color: var(--color-success);
}

.dropdown-menu {
  position: absolute;
  right: 10px;
  top: 40px;
  background-color: var(--color-30);
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-menu ul li {
  padding: 10px;
  cursor: pointer;
}

.dropdown-menu ul li:hover {
  background-color: var(--color-40);
}

.message-author {
  font-size: 16px;
  font-weight: 400;
}

.last-message {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>
