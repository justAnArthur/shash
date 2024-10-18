<template>
  <img class="avatar" src="https://xsgames.co/randomusers/avatar.php?g=pixel" alt="">
  <div style="display: grid; gap: 0.5rem">
    <div style="display:flex; gap: 0.5rem; align-items: center">
      <h2 class="chat-name">{{ props.chatName }}</h2>
      <p class="message-time">{{ timeDisplay }}</p>
    </div>
    <span class="message-text">
      {{ props.lastMessage.text }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, onBeforeUnmount, ref } from 'vue'
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

const timeDisplay = ref('');
let intervalId: ReturnType<typeof setInterval>;

const setNextUpdate = (nextInterval: number) => {
  clearInterval(intervalId);
  intervalId = setInterval(updateTime, nextInterval);
};

onMounted(() => {
  updateTime();
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});

const updateTime = () => {
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
    clearInterval(intervalId);
    timeDisplay.value = new Date(props.lastMessage.time).toLocaleDateString([], { month: "short", day: "numeric" })
  } else {
    clearInterval(intervalId);
    timeDisplay.value = new Date(props.lastMessage.time).toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" })
  }
}

</script>
<style scoped>
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
</style>
