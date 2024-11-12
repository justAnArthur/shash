import { api } from "boot/axios"
import type { Router } from "vue-router"
import { updateChatMine } from "src/app/components/chat-list.store"

export const commands = ({ router }: { router: Router }) => [
  {
    slash: '/join',
    parameters: ['chatName'],
    suggestions: async (chatName?: string) => {
      if (chatName === undefined)
        return [{
          text: '/join [chatName]'
        }]

      const { data: chats } = await api.get('/chat/public?search=' + chatName)

      return chats.map((chat: any) => ({
        text: chat.channelName,
        onEnter: async () => {
          await api.post('/chat/join/' + chat.id)
          await updateChatMine()
        }
      }))
    }
  },
  {
    slash: '/create',
    parameters: ['chatName', 'privatePublic'],
    suggestions: async (chatName?: string, privatePublic?: string) => {
      if (!chatName || !privatePublic || !['public', 'private'].includes(privatePublic))
        return [{
          text: '/create [chatName] [private/public]'
        }]

      return [{
        text: `Create ${chatName} ${privatePublic} channel`,
        onEnter: async () => {
          const { data } = await api.put('/chat/create', {
            chatName,
            isPrivate: privatePublic == 'private'
          })
          await updateChatMine()
          await router.push('/chats/' + data.chat.id)
        }
      }]
    }
  }
]
