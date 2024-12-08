<template>
  <div
    style="position: relative; aspect-ratio: 1/1; width: 100%; display: grid; place-content: center; background-color: var(--color-30); border-radius: 1rem">
    <img class="avatar" :src="`https://picsum.photos/seed/${props.user.nickname}/200/300`" alt="">

    <user-status-badge additional-classes="avatar-status" :notification-status="user?.notificationStatus"
                       :notify-when-tagged="user?.notifyWhenTagged"/>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import UserStatusBadge from "src/app/components/user-status-badge.vue"

const props = defineProps<{
  user: {
    nickname: string,
    notificationStatus: any,
    notifyWhenTagged: any
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

.avatar-status {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
}
</style>
