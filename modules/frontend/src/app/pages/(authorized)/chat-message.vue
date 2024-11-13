<template>
  <div :class="['chat-message', { 'highlighted': isHighlighted }]">
    <img class="avatar" src="https://xsgames.co/randomusers/avatar.php?g=male" alt="">
    <div style="display: grid; gap: 0.5rem">
      <div style="display: flex; gap: 0.5rem; align-items: center">
        <h2 style="font-weight: 600; line-height: 1; font-size: 16px">{{ username }}</h2>
        <div style="color: hsla(0, 0%, 97%, .25); line-height: 1;">{{ formattedTime }}</div>
      </div>
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { useAuth } from 'src/lib/composables/useAuth'
const { user } = useAuth()

const props = defineProps<{
  username: string,
  createdAt: Date,
  content: string
}>()

const isHighlighted = props.content.includes(`@${user.value.nickname}`);

const formattedTime = computed(() =>
  props.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
)
</script>

<style scoped>
.chat-message {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 20px;
  background: hsla(0, 0%, 97%, .05);
  color: hsla(0, 0%, 97%, .56);
}

.highlighted {
  background-color: hsla(200, 100%, 60%, 0.5); /* Light blue highlight */
  border-left: 4px solid hsla(200, 100%, 60%, 1); /* Blue left border */
}

#chat-header h1 {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.5rem;
}

#chat-header img {
  border-radius: 999px;
  min-width: 3rem;
  min-height: 3rem;
  max-width: 3rem;
  max-height: 3rem;
  aspect-ratio: 1/1;
}
</style>
