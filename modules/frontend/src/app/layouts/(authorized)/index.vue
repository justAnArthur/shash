<template>
  <section id="page">
    <navigation/>

    <main>
      <router-view name="home"/>
    </main>

    <aside v-if="isWideEnough" id="chat-side">
      <router-view name="chat-side"/>
    </aside>
  </section>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import Navigation from 'src/app/components/navigation.vue'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const isWideEnough = ref(false)
const route = useRoute()
const router = useRouter()

const currentRoute = ref(route.fullPath)
watch(() => route.fullPath, (newPath) => {
  currentRoute.value = newPath
})

const checkWidth = () => {
  isWideEnough.value = window.innerWidth > 1024
}

onMounted(() => {
  checkWidth()
  window.addEventListener('resize', checkWidth)

})

onUnmounted(() => {
  window.removeEventListener('resize', checkWidth)
})
</script>

<style scoped>
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

main {
  padding: 1rem;
  flex: 1 1 0;
}
</style>
