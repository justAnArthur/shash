<template>
  <header id="chat-header">
    <q-btn href="#/chats" style="aspect-ratio: 1/1">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
           class="lucide lucide-chevron-left">
        <path d="m15 18-6-6 6-6"/>
      </svg>
    </q-btn>

    <h1 style="flex: 1 1 0">{{ chat.channelName }}</h1>

    <q-btn style="aspect-ratio: 1/1">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
           class="lucide lucide-ellipsis">
        <circle cx="12" cy="12" r="1"/>
        <circle cx="19" cy="12" r="1"/>
        <circle cx="5" cy="12" r="1"/>
      </svg>

      <q-menu
        v-model="menu"
        anchor="bottom left"
        self="top left"
        class="full-width-mobile"
        max-width="20rem"
        style="background-color: transparent;"
      >
        <div id="chat-header-modal" class="row no-wrap q-pa-md">
          <div class="column full-width" style="gap: 0.5rem">
            <h3 class="text-h6">
              Chat Settings
            </h3>

            <q-btn @click="leaveChat()">
              Leave Chat
            </q-btn>

            <q-btn @click="destroyChat()">
              Destroy Chat
            </q-btn>

            <!--            <q-separator dark/>-->

            <!--            <h4>Chat Members</h4>-->
            <!--            <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; width: 100%;">-->
            <!--              <chat-member v-for="n in 6" :key="n"/>-->
            <!--            </div>-->
          </div>
        </div>
      </q-menu>
    </q-btn>
  </header>
</template>

<script>
import ChatMember from "src/app/pages/(authorized)/chat-member.vue"
import { useAuth } from "src/lib/composables/useAuth"
import { api } from "boot/axios"
import { updateChatMine } from "src/app/components/chat-list.store"

export default {
  name: 'chat-head',
  components: { ChatMember },

  props: {
    chat: {
      type: Object,
      required: true
    }
  },

  computed: {
    isMobile() {
      return this.$q.screen.xs || this.$q.screen.sm
    }
  },

  methods: {
    logout() {
      this.menu = false
      this.$q.notify({
        message: 'Logged out successfully',
        color: 'green',
        position: 'top'
      })
    },
    leaveChat() {
      api.post('/chat/leave/' + this.chat.id)
        .then(() => {
          updateChatMine()
          this.$router.push({ path: '/' })
        })
    },
    destroyChat() {
      api.delete('/chat/destroy/' + this.chat.id)
        .then(() => {
          updateChatMine()
          this.$router.push({ path: '/' })
        })
    }
  },

  data() {
    const auth = useAuth()

    return {
      menu: false,
      mobileData: false,
      isAdmin: auth.user.value.id === this.chat.userOwnerId,
      bluetooth: false
    }
  }
}
</script>

<style>
#chat-header {
  display: flex;
  gap: 1rem;
  align-items: center;

  margin-bottom: auto;
}

#chat-header h1 {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.5rem;
  text-overflow: ellipsis;
  text-wrap: nowrap;
}

#chat-header-modal {
  background-color: var(--color-10);
  border-radius: 10px;
}

.full-width-mobile {
  width: 100%;
  margin: 0 1rem;
}
</style>
