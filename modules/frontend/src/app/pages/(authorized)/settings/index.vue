<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('online')
</script>

<template>
  <div>
    <h2>Notifications</h2>

    <div>
      <q-tabs
        v-model="tab">
        <q-tab name="online" label="Online"
               :class="{ 'selected-tab': tab === 'online' }"
        />
        <q-tab name="dnd" label="DND"
               :class="{ 'selected-tab': tab === 'dnd' }"
        />
        <q-tab name="offline" label="Offline"
               :class="{ 'selected-tab': tab === 'offline' }"
        />
      </q-tabs>
    </div>
  </div>
</template>

<style scoped>
h2 {
  font-size: x-large;
}

.q-tabs {
  background-color: var(--color-20);
  border-radius: 1rem;
}

.q-tab {
  width: 100%;
  margin: 0.5rem;
  border-radius: 32px;
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
</style>
