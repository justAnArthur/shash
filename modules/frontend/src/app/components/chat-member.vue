<template>
  <div
    style="aspect-ratio: 1/1; width: 100%; display: grid; place-content: center; background-color: var(--color-30); border-radius: 1rem">
    <img class="avatar" :src="`https://picsum.photos/seed/${props.user.nickname}/200/300`" alt="">
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  user: {
    nickname: string
  }
}>()
</script>
<style scoped>
.avatar {
  border-radius: 999px;
  min-width: 3rem;
  min-height: 3rem;
  max-width: 3rem;
  max-height: 3rem;
  aspect-ratio: 1/1;
}
</style>
