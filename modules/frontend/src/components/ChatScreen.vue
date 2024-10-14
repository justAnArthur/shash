<template>
  <div class="chat-screen overflow-auto" ref="messageContainer">
    <q-infinite-scroll class="col-12 col-md-8" @load="loadOlderMessages" :offset="250" reverse ref="infiniteScroll">
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>

      <q-list>
        <q-item v-for="message in messages" :key="message.id" :class="{ 'justify-end': message.isMe }">
          <q-item-section :side="message.isMe">
            <q-chat-message
              :name="message.username"
              :text="[message.text]"
              :sent="message.isMe"
              :stamp="formatTimestamp(message.timestamp)"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-infinite-scroll>

    <q-dialog v-model="showTypingPreview" position="bottom">
      <q-card style="width: 350px">
        <q-card-section>
          <div class="text-h6">{{ typingUser }} is typing:</div>
          <div class="q-mt-sm">{{ typingPreview }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-inner-loading :showing="isLoading">
      <q-spinner-dots size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, nextTick, watch, inject } from 'vue'
import { date } from 'quasar'

export default defineComponent({
  name: 'ChatScreen',
  props: {
    chatId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { messages } = inject('chatContext')
    const isLoading = ref(true)
    const messageContainer = ref(null)
    const infiniteScroll = ref(null)
    const showTypingPreview = ref(false)
    const typingUser = ref('')
    const typingPreview = ref('')
    const page = ref(1)

    const formatTimestamp = (timestamp) => {
      return date.formatDate(timestamp, 'HH:mm')
    }

    const scrollToBottom = async () => {
      await nextTick()
      if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight
      }
    }

    const simulateIncomingMessage = () => {
      setTimeout(() => {
        messages.value.push({
          id: Date.now(),
          username: 'John',
          text: 'Hey there! How are you?',
          isMe: false,
          timestamp: new Date()
        })
        scrollToBottom()
      }, 2000)
    }

    const simulateTyping = () => {
      setTimeout(() => {
        typingUser.value = 'Alice'
        typingPreview.value = 'I wanted to ask you about...'
        showTypingPreview.value = true
      }, 3000)
    }

    const loadOlderMessages = (index, done) => {
      setTimeout(() => {
        const olderMessages = [
          {
            id: Date.now() - 1000000,
            username: 'John',
            text: `This is an older message (page ${page.value}) for chat ${props.chatId}`,
            isMe: false,
            timestamp: new Date(Date.now() - 1000000)
          },
          {
            id: Date.now() - 2000000,
            username: 'Me',
            text: `This is another older message (page ${page.value}) for chat ${props.chatId}`,
            isMe: true,
            timestamp: new Date(Date.now() - 2000000)
          }
        ]
        messages.value.unshift(...olderMessages)
        page.value++
        done()
        console.log("Loaded older messages for chat", props.chatId)
      }, 1000)
    }

    const loadInitialMessages = () => {
      // Simulating API call to load initial messages
      isLoading.value = true
      setTimeout(() => {
        messages.value = [
          {
            id: Date.now() - 3000000,
            username: 'John',
            text: `Welcome to chat ${props.chatId}!`,
            isMe: false,
            timestamp: new Date(Date.now() - 3000000)
          }
        ]
        isLoading.value = false
        scrollToBottom()
      }, 1000)
    }

    onMounted(() => {
      loadInitialMessages()
      simulateIncomingMessage()
      simulateTyping()
    })

    watch(() => props.chatId, () => {
      // Reset and reload messages when chatId changes
      page.value = 1
      loadInitialMessages()
    })

    watch(messages, () => {
      scrollToBottom()
    })

    return {
      messages,
      isLoading,
      messageContainer,
      infiniteScroll,
      showTypingPreview,
      typingUser,
      typingPreview,
      formatTimestamp,
      loadOlderMessages
    }
  }
})
</script>

<style scoped>
.chat-screen {
  height: calc(100vh - 56px); /* Adjust this value based on your header and input field heights */
  overflow-y: auto;
  overflow-x: hidden;
}

.chat-screen::-webkit-scrollbar {
  width: 8px;
}

.chat-screen::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-screen::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.chat-screen::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
