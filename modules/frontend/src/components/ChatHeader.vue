<template>
  <q-toolbar class="text-white text-center shadow-2">
    <q-toolbar-title class="text-h4 q-mt-sm">{{ chatName }}</q-toolbar-title>
  </q-toolbar>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'ChatHeader',
  props: {
    chatName: {
      type: String,
      required: true
    }
  },
  setup(props) {
    return {
      chatName: props.chatName
    }
  }
})
</script>
<style scoped>
.q-header {
  height: 8vh;
}

.q-toolbar {
  background: radial-gradient(circle, rgba(36, 37, 44, 1) 0%, rgba(57, 63, 94, 1) 50%, rgba(97, 101, 117, 1) 100%);
  border-radius: 25px 25px 0 0;
}
</style>
