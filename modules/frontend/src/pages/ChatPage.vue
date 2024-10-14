<template>

  <div class="flex column items-center">
    <chat-header :chat-name="currentChatId" />
    <chat-screen :chat-id="currentChatId" class="col-6" />
    <chat-input />
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
      messages.value.push(message)
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
.chat-container {
  width: 60%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

::-webkit-scrollbar {
  display: none;
}

* {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
