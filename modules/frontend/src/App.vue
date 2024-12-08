<template>
  <router-view/>
</template>

<script setup lang="ts">
import { onMounted, getCurrentInstance } from "vue";
import { io } from "socket.io-client";
import { useNotifications } from "src/lib/composables/useNotification";
import { useAuth } from "src/lib/composables/useAuth";

const socket = io("http://localhost:3333");
const { showNotification } = useNotifications();
const { user } = useAuth();

onMounted(() => {
  socket.on("chat:message", (incomingMessage: any) => {
    showNotification(
      incomingMessage.username,
      { body: incomingMessage.content as string },
      incomingMessage.content.includes(`@${user.value?.nickname}`)
    );
  });
});

const app = getCurrentInstance()?.appContext.app;
app.config.globalProperties.$socket = socket;
defineOptions({
  name: "App"
})
</script>
