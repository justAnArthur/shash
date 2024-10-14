<template>
  <q-footer class="bg-white row justify-center ">
        <q-input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          outlined
          class="col-12 col-md-6 text-black justify-center"
          borderless
          rounded
          bg-color="white"
          placeholder="Type a message..."
        >
          <template v-slot:append>
            <q-btn round dense flat icon="send" @click="sendMessage" />
          </template>
        </q-input>
  </q-footer>
</template>

<script>
import { defineComponent, ref, inject } from 'vue'

export default defineComponent({
  name: 'ChatInput',
  setup() {
    const newMessage = ref('')
    const { addMessage } = inject('chatContext')

    const sendMessage = () => {
      if (newMessage.value.trim()) {
        addMessage({
          id: Date.now(),
          username: 'Me',
          text: newMessage.value,
          isMe: true,
          timestamp: new Date()
        })
        newMessage.value = ''
      }
    }

    return {
      newMessage,
      sendMessage
    }
  }
})
</script>
<style>
.q-toolbar {
  border-radius: 12.5px;
}
</style>
