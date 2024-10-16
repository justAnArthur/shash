<template>
  <q-toolbar class="shadow-up-2 footer-div">
    <q-input v-model="newMessage" @keyup.enter="sendMessage" borderless dense class="full-width q-my-md"
      placeholder="Type /help or a message">
      <template v-slot:append>
        <q-btn round dense flat icon="send" @click="sendMessage" />
      </template>
    </q-input>
  </q-toolbar>
</template>

<script>
import { defineComponent, ref, inject, watch } from 'vue'

export default defineComponent({
  name: 'ChatInput',
  setup() {
    const commands = {
      "help": "Show this help message",
      "register": "Register a new user",
      "login": "Login a user",
      "logout": "Logout a user"
    }
    const newMessage = ref('')
    const { addMessage } = inject('chatContext')

    const processCommand = (value) => {
      // TODO: Implement command logic
      console.log("No command processing yet")

    }
    const sendMessage = () => {
      if (newMessage.value.trim()) {
        if (newMessage.value.startsWith('/')) {
          console.log("No command logic yet")
        } else {
          addMessage({
            id: Date.now(),
            username: 'Me',
            text: newMessage.value,
            isMe: true,
            timestamp: new Date()
          })
        }
        newMessage.value = ''
      }
    }

    watch(newMessage, () => {
      if (newMessage.value.trim()) {
        if (newMessage.value.startsWith('/')) {
          processCommand(newMessage.value)
        } else {
          // TODO: Websocket message typing logic.
        }
      }
    })
    return {
      newMessage,
      sendMessage,
    }
  }
})
</script>
<style>
.rounded-gradient-toolbar {
  border-radius: 12px;
  background: radial-gradient(circle, rgba(36, 37, 44, 1) 0%, rgba(57, 63, 94, 1) 50%, rgba(97, 101, 117, 1) 100%);
  backdrop-filter: blur(50px);
  opacity: 0.9;
}

.footer-div {
  background: radial-gradient(circle, rgba(36, 37, 44, 1) 0%, rgba(57, 63, 94, 1) 50%, rgba(97, 101, 117, 1) 100%);
  border-radius: 0 0 25px 25px;
}

.q-input {}
</style>
