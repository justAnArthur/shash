<template>
  <div class="row justify-center bg-dark" style="padding: 5vh 0">
    <div class="chat-container col-12 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-lg-4 col-lg-offset-4">
      <chat-header :chat-name="currentChatId" />
      <chat-screen :chat-id="currentChatId" />
      <chat-input />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, provide } from 'vue'
import ChatScreen from '../components/ChatScreen.vue'
import ChatInput from '../components/ChatInput.vue'
import ChatHeader from '../components/ChatHeader.vue'

export default defineComponent({
  name: 'ChatPage',
  components: {
    ChatScreen,
    ChatInput,
    ChatHeader
  },
  setup() {
    const currentChatId = ref('chat123') // This could be set dynamically, e.g., from route params
    const messages = ref([])

    const addMessage = (message) => {
      messages.value = [...messages.value, message] // Add the new message to the list(message)
    }

    // Provide the shared state and methods
    provide('chatContext', {
      messages,
      addMessage
    })

    return {
      currentChatId
    }
  }
})
</script>

<style>
::-webkit-scrollbar {
  display: none;
}

* {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.chat-container {
  background: rgb(36, 37, 44);
  border-radius: 25px;
}

.q-toolbar {
  height: 5vh;
}
</style>
