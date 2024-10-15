<template>
  <q-scroll-area class="chat-screen overflow-auto q-pt-xs" ref="messageContainer">
    <q-infinite-scroll @load="loadOlderMessages" reverse :offset="250" scroll-target="messageContainer">
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
      <q-list>
        <q-item v-for="message in messages" :key="message.id" :class="{ 'justify-end': message.isMe }">
          <q-item-section :side="message.isMe">
            <q-chat-message bg-color="dark" text-color="grey" class="chat-message" :name="message.username"
              :text="[message.text]" :sent="message.isMe" :stamp="formatTimestamp(message.timestamp)" />
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

  </q-scroll-area>
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
    const isLoading = ref(false)
    const page = ref(1)
    const messageContainer = ref(null)

    const formatTimestamp = (timestamp) => {
      return date.formatDate(timestamp, 'HH:mm')
    }

    const scrollToBottom = () => {
      nextTick().then(() => {
        if (messageContainer.value) {
          messageContainer.value.setScrollPosition('vertical', messageContainer.value.getScrollTarget().scrollHeight, 500);
        }
      })
    }


    const updateMessages = () => {
      return []
    }
    const messageFormat = (message) => {

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
        done();
        console.log("Loaded older messages for chat", props.chatId)
      }, 1000)
    }

    onMounted(() => {
      // Load messages when component is mounted
      console.log("Mounted")
    })

    watch(() => props.chatId, () => {
      // Reset and reload messages when chatId changes
      page.value = 1
      messages.value = updateMessages()
    })

    /*
    watch(() => messages.value,
      () => {

        scrollToBottom()

        console.log("messages updated")
      }, { deep: true })
    */

    return {
      messages,
      isLoading,
      formatTimestamp,
      loadOlderMessages,
      messageContainer
    }
  }
})
</script>

<style scoped>
.chat-screen {
  height: 80vh;
}

.chat-message {
  color: white;
}
</style>
