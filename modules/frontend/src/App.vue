<template>
  <router-view/>
</template>

<script setup lang="ts">
import { onMounted, getCurrentInstance } from "vue";
import { io } from "socket.io-client";
import { useNotifications } from "src/lib/composables/useNotification";
import { useAuth } from "src/lib/composables/useAuth";
import { chatsMine, updateChatMine } from 'src/app/components/chat-list.store'
const socket = io("http://localhost:3333");
const { showNotification } = useNotifications();
const { user } = useAuth();

onMounted( async () => {
  await updateChatMine();
  chatsMine.value.forEach(element => {
    const { id } = element
    socket.emit('join:room', id)

  });
  socket.on("chat:message", (incomingMessage: any) => {
    if(incomingMessage.username === user.value.nickname) return;
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
