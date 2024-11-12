<template>
  <img class="avatar" src="https://xsgames.co/randomusers/avatar.php?g=pixel" alt="">
  <div style="display: grid; gap: 0.25rem; width:100%;">
    <div style="display:flex; gap: 0.5rem; align-items: center; justify-content: space-between">
      <div class="chat-info">
        <div style="display: flex; gap: 0.25rem; align-items: center">
          <h2 class="chat-name">{{ props.chatName }}</h2>
          <div class="message-dot"/>
        </div>
        <p class="message-time">{{ timeDisplay }}</p>
      </div>
      <div class="q-btn three-dots" :class="{ 'menu-visible': menuVisible }">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             class="lucide lucide-log-out">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" x2="9" y1="12" y2="12"/>
        </svg>
      </div>
    </div>
    <div class="last-message" v-if="props.lastMessage">
      <p class="message-author">{{ props.lastMessage.author }}</p>
      <p class="message-text">
        {{ props.lastMessage.text }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onBeforeUnmount, onMounted, ref } from 'vue'
import { IMessage } from './models.ts'

const props = defineProps({
  chatName: {
    type: String,
    required: true
  },
  lastMessage: {
    type: IMessage,
    required: true
  }
})

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
  if(!props.lastMessage) return;
  const time = Date.now() - props.lastMessage.time
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
    timeDisplay.value = new Date(props.lastMessage.time).toLocaleDateString([], { month: "short", day: "numeric" })
  } else {
    clearInterval(intervalId)
    timeDisplay.value = new Date(props.lastMessage.time).toLocaleDateString([], {
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
</style>
