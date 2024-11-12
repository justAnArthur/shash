import { ref } from "vue"
import { api } from "boot/axios"
// import type Chat from "@slash/backend/app/models/chat"
// import type Message from "@slash/backend/app/models/message"

const chatsMine = ref</*(Chat & { lastMessage: Message })[]*/ any[]>([])

async function updateChatMine() {
  chatsMine.value = await api.get('/chat/mine').then(({ data }) => data)
}

export { chatsMine, updateChatMine }
