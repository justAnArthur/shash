<template>
  <main id="page">
    <navigation v-if="isWideEnough" />
    <main class="chat" :class="{ 'column-direction': currentRoute.startsWith('/chats') }" style="flex: 1 1 0;">
      <router-view name="home" />
    </main>

    <aside v-if="isWideEnough" id="chat-side">
      <router-view name="chat-side" />
    </aside>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Navigation from 'src/components/navigation.vue'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const isWideEnough = ref(false)
const route = useRoute()
const router = useRouter()

const currentRoute = ref(route.fullPath)
watch(() => route.fullPath, (newPath) => {
  currentRoute.value = newPath
})

const checkWidth = () => {
  isWideEnough.value = window.innerWidth > 1024
  if (isWideEnough.value) {
    router.replace('/')
  }
}

onMounted(() => {
  checkWidth()
  window.addEventListener('resize', checkWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkWidth)
})
</script>

<style>
#page {
  display: flex;
  height: 100vh;
  width: 100vw;
}

#chat-side {
  background-color: var(--color-10);
  padding: 1rem;
  width: 20rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chat {
  height: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column-reverse;
  gap: 1rem;
}

.column-direction {
  flex-direction: column;
}
</style>
