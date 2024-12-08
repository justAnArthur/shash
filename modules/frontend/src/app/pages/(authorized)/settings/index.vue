<script setup lang="ts">
import { ref } from 'vue';
import { api } from 'boot/axios'

const tab = ref('online');
const notificationStatus = ref('');


// Function to set the new notification status based on the selected tab
async function setStatus(newStatus: string) {
  try {
    const response = await api.post('/user/notifications', { status: newStatus.toUpperCase() });
    if (response.status === 200) {
      notificationStatus.value = newStatus;
    }
  } catch (error) {
    console.error('Error updating notification status:', error);
  }
}

</script>

<template>
  <div>
    <h2>Notifications</h2>
    <div class="tab-container">
      <button
        class="tab-button"
        :class="{ 'selected-tab': tab === 'online' }"
        @click="setStatus('online'); tab = 'online'"
      >
        Online
      </button>
      <button
        class="tab-button"
        :class="{ 'selected-tab': tab === 'dnd' }"
        @click="setStatus('dnd'); tab = 'dnd'"
      >
        DND
      </button>
      <button
        class="tab-button"
        :class="{ 'selected-tab': tab === 'offline' }"
        @click="setStatus('offline'); tab = 'offline'"
      >
        Offline
      </button>
    </div>
  </div>
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
  flex: 1; /* Allow buttons to take equal space */
  margin: 0.5rem;
  border-radius: 32px;
  background: transparent; /* Make background transparent for styling */
  border: none; /* Remove default button border */
  cursor: pointer;
  padding: 10px; /* Add some padding for a better click area */
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
  -webkit-mask-image: linear-gradient(175deg, #000, transparent 50%);
  mask-image: linear-gradient(175deg, #000, transparent 50%);
}

.tab-button:hover {
  background-color: rgba(255, 255, 255, 0.1); /* Optional hover effect */
}
</style>
