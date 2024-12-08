// src/composables/useSocket.ts
import { ref, onUnmounted } from "vue";
import io, { Socket } from "socket.io-client";
import { useNotifications } from "./useNotification";
import { useAuth } from "./useAuth";

const socket = ref<typeof Socket | null>(null);

export function useSocket() {
  // Ensure a single instance of the socket connection
  const { showNotification } = useNotifications();
  const { user } = useAuth();
  if (!socket.value) {
    socket.value = io("http://localhost:3333");
  }
  /* ts-ignore */
  socket.value.on("chat:message", (incomingMessage: any) => {
    console.log(incomingMessage);
    showNotification(
      incomingMessage.username,
      { body: incomingMessage.content as string },
      incomingMessage.content.includes(`@${user.value?.nickname}`),
    );
  });

  function emit(event: string, payload: any) {
    if (socket.value) {
      socket.value.emit(event, payload);
    } else {
      console.warn("Socket is not connected.");
    }
  }

  function on(event: string, callback: (payload: any) => void) {
    if (socket.value) {
      socket.value.on(event, callback);
    } else {
      console.warn("Socket is not connected.");
    }
  }

  function off(event: string, callback: (payload: any) => void) {
    if (socket.value) {
      socket.value.off(event, callback);
    }
  }

  onUnmounted(() => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
    }
  });

  return {
    emit,
    on,
    off,
    socket,
  };
}
