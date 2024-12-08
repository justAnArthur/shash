// src/composables/useSocket.ts
import { getCurrentInstance } from "vue";

export function useSocket() {
  const socket =
    getCurrentInstance()?.appContext.config.globalProperties.$socket;

  function emit(event: string, payload: any) {
    socket?.emit(event, payload);
  }

  function on(event: string, callback: (payload: any) => void) {
    socket?.on(event, callback);
  }

  function off(event: string, callback: (payload: any) => void) {
    socket?.off(event, callback);
  }

  return {
    emit,
    on,
    off,
    socket,
  };
}
