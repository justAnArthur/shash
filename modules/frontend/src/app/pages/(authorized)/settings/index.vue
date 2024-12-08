<script setup lang="ts">
import { ref } from 'vue'
import { api } from 'boot/axios'
import { useAuth } from "src/lib/composables/useAuth";
import type { User } from "src/lib/composables/useAuth"
import type { AxiosResponse } from "axios"

const { getUserFromServer, user} = useAuth();
api.get('/user/me')
  .then((res: AxiosResponse<User>) => {
    notificationStatus.value = res.data.notificationStatus
    notificationWhenTaggedStatus.value = res.data.notifyWhenTagged
  })

const notificationStatus = ref(user.value.notificationStatus)

async function setNotificationStatus(newStatus: string) {
  try {
    const response = await api.post('/user/notifications', { status: newStatus })
    if (response.status === 200) {
      notificationStatus.value = newStatus
      getUserFromServer();
    }
  } catch (error) {
    console.error('Error updating notification status:', error)
  }
}

const notificationWhenTaggedStatus = ref(user.value.notificationWhenTaggedStatus)

async function setNotificationWhenTaggedStatus(newStatus: string) {
  try {
    const response = await api.post('/user/notificationsWhenTagged', { status: newStatus })
    if (response.status === 200) {
      notificationWhenTaggedStatus.value = newStatus
    }
  } catch (error) {
    console.error('Error updating notification status:', error)
  }
}
</script>

<template>
  <section>
    <h2>Notifications</h2>
    <div class="tab-container">
      <button
        class="tab-button"
        :class="{ 'selected-tab': notificationStatus === 'ONLINE' }"
        @click="setNotificationStatus('ONLINE'); notificationStatus = 'ONLINE'"
      >
        Online
      </button>
      <button
        class="tab-button"
        :class="{ 'selected-tab': notificationStatus === 'DND' }"
        @click="setNotificationStatus('DND'); notificationStatus = 'DND'"
      >
        DND
      </button>
      <button
        class="tab-button"
        :class="{ 'selected-tab': notificationStatus === 'OFFLINE' }"
        @click="setNotificationStatus('OFFLINE'); notificationStatus = 'OFFLINE'"
      >
        Offline
      </button>
    </div>
  </section>

  <section>
    <h2>Notification when tagged</h2>
    <div class="tab-container">
      <button
        class="tab-button"
        :class="{ 'selected-tab': notificationWhenTaggedStatus === 'ALL' }"
        @click="setNotificationWhenTaggedStatus('ALL'); notificationWhenTaggedStatus = 'ALL'"
      >
        All
      </button>
      <button
        class="tab-button"
        :class="{ 'selected-tab': notificationWhenTaggedStatus === 'TAGGED' }"
        @click="setNotificationWhenTaggedStatus('TAGGED'); notificationWhenTaggedStatus = 'TAGGED'"
      >
        Only tagged
      </button>
    </div>
  </section>
</template>

<style scoped>
h2 {
  font-size: x-large;
}

.tab-container {
  display: flex;
  background-color: var(--color-20);
  border-radius: 1rem;
}

.tab-button {
  flex: 1;
  margin: 0.5rem;
  border-radius: 32px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 10px;
  transition: background-color 0.3s ease;
}

.selected-tab {
  background-color: var(--color-0);
}

.selected-tab:before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 32px;
  pointer-events: none;
  border: 1.5px solid hsla(0, 0%, 100%, 0.1);
  -webkit-mask-image: -webkit-linear-gradient(175deg, #000, transparent 50%);
  mask-image: linear-gradient(175deg, #000, transparent 50%);
}

.tab-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
