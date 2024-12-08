<template>
  <div :class="['status-badge', statusClass, additionalClasses]"></div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps<{
  notificationStatus: 'ONLINE' | 'DND' | 'OFFLINE',
  notifyWhenTagged: 'TAGGED' | 'ALL',
  additionalClasses?: string | string[]
}>()

const statusClass = computed(() => {
  if (props.notificationStatus === 'DND')
    return 'dnd'

  if (props.notifyWhenTagged === 'TAGGED')
    return 'tagged'

  if (props.notificationStatus === 'ONLINE') {
    return 'online'
  } else if (props.notificationStatus === 'OFFLINE') {
    return 'offline'
  } else {
    return ''
  }
})
</script>

<style scoped>
.status-badge {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
}

.status-badge.online {
  background-color: green;
}

.status-badge.dnd {
  background-color: red;
}

.status-badge.offline {
  border: 2px solid gray;
  background-color: transparent;
}

.status-badge.tagged {
  background-color: orange;
}
</style>
