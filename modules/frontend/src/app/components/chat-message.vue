<template>
  <div :class="['chat-message', isMe ? 'right' : 'left']">
    <img v-if="!isMe" class="avatar" :src="`https://picsum.photos/seed/${username}/200/200`" :alt="username"/>

    <div style="display: grid; gap: 0.5rem">
      <div style="display: flex; gap: 0.5rem; align-items: center">
        <div style="display: flex; align-items: center; gap: 0.5rem">
          <h2 v-if="!isMe" style="font-weight: 600; line-height: 1; font-size: 16px">{{ username }}</h2>

          <!--          <user-status-badge :notification-status="user?.notificationStatus"-->
          <!--                             :notify-when-tagged="user?.notifyWhenTagged"/>-->
        </div>
        <div style="color: hsla(0, 0%, 97%, 0.25); line-height: 1;">{{ formattedTime }}</div>
      </div>
      <p :class="{ highlighted: isHighlighted }">{{ content }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { useAuth } from 'src/lib/composables/useAuth'

const { user } = useAuth()

const props = defineProps<{
  username: string;
  createdAt: Date;
  content: string;
}>()

const isMe = computed(() => props.username === user.value?.nickname)

const isHighlighted = computed(() =>
  props.content.includes(`@${user.value?.nickname}`)
)

const formattedTime = computed(() =>
  props.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
)
</script>

<style scoped>
.chat-message {
  display: flex;
  max-width: 60%; /* Limits message width */
  width: fit-content;
  gap: 1rem;
  padding: 1rem;
  border-radius: 20px;
  background: hsla(0, 0%, 97%, 0.05);
  color: hsla(0, 0%, 97%, 0.56);
  margin-bottom: 1rem;
}

/* Left-aligned messages */
.chat-message.left {
  align-self: flex-start;
  margin-left: 0; /* No extra space on the left */
  margin-right: auto; /* Pushes to the left */
}

/* Right-aligned messages */
.chat-message.right {
  align-self: flex-end;
  margin-right: 0; /* No extra space on the right */
  color: white;
}

.chat-message img.avatar {
  border-radius: 999px;
  min-width: 3rem;
  min-height: 3rem;
  max-width: 3rem;
  max-height: 3rem;
  aspect-ratio: 1 / 1;
}

.highlighted {
  background-color: hsla(200, 100%, 60%, 0.2); /* Light blue highlight */
  border-radius: 8px;
  padding: 0.5rem;
  display: inline-block;
}
</style>
