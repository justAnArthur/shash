<template>
  <header id="chat-header">
    <q-btn href="#/chats" style="aspect-ratio: 1/1">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
           class="lucide lucide-chevron-left">
        <path d="m15 18-6-6 6-6"/>
      </svg>
    </q-btn>

    <h1 style="flex: 1 1 0">{{ channelName }}</h1>

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
        style="background-color: transparent;"
      >
        <div id="chat-header-modal" class="row no-wrap q-pa-md">
          <div class="column full-width">
            <div class="text-h6 q-mb-md">Chat Settings</div>
            <q-toggle color="grey" v-model="mobileData" label="Use Mobile Data"/>
            <q-toggle color="grey" v-model="bluetooth" label="Bluetooth"/>

            <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; width: 100%;">
              <chat-member v-for="n in 6" :key="n"/>
            </div>
          </div>
        </div>
      </q-menu>
    </q-btn>
  </header>
</template>

<script>
import ChatMember from "pages/(authorized)/chat-member.vue"

export default {
  name: 'chat-head',
  components: { ChatMember },

  props: {
    channelName: {
      type: String,
      required: true
    },
    isPrivate: {
      type: Boolean
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
    }
  },

  data() {
    return {
      menu: false,
      mobileData: false,
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
