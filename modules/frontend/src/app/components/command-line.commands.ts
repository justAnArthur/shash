import { api } from "boot/axios"
import type { Router } from "vue-router"
import { updateChatMine } from "src/app/components/chat-list.store"

export const commands = ({ router, context: { chat, userId } }: { router: Router, context: any }) => {
  return [
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
    },
    {
      slash: '/invite',
      parameters: ['query'],
      suggestions: async (query?: string) => {
        if (!query || query.length < 5)
          return [{
            text: '/invite [user:{5,}]'
          }]

        return (await api.get('/user/byQuery/' + query).then(({ data }) => data))
          .filter((user: any) => user.id !== userId)
          .map((user: any) => {
            return ({
              text: user.name + ' ' + user.surname,
              onEnter: async () => {
                await api.post('/chat/invite', {
                  userId: user.id,
                  chatId: chat.id
                })
              }
            })
          })
      },
      visible: !!chat && (chat.isPrivate === false || chat.userOwnerId === userId)
    },
    {
      slash: '/kick',
      parameters: ['query'],
      suggestions: async (query?: string) => {
        if (!query || query.length < 5)
          return [{
            text: '/kick [user:{5,}]'
          }]

        return (await api.get('/user/byQuery/' + query).then(({ data }) => data))
          .filter((user: any) => user.id !== userId)
          .map((user: any) => {
            return ({
              text: user.name + ' ' + user.surname,
              onEnter: async () => {
                await api.post('/chat/kick', {
                  userId: user.id,
                  chatId: chat.id
                })
              }
            })
          })
      },
      visible: !!chat
    },
    {
      slash: '/resolve',
      parameters: ['query'],
      suggestions: async (query?: string) => {
        if (!query || query.length < 5)
          return [{
            text: '/resolve [user:{5,}]'
          }]

        return (await api.get('/user/byQuery/' + query).then(({ data }) => data))
          .filter((user: any) => user.id !== userId)
          .map((user: any) => {
            return ({
              text: user.name + ' ' + user.surname,
              onEnter: async () => {
                await api.post('/chat/kick/resolve', {
                  userId: user.id,
                  chatId: chat.id
                })
              }
            })
          })
      },
      visible: !!chat && chat.userOwnerId === userId
    }
  ]
    .filter(command => {
      console.log('command.visible', command.visible, command)
      return command.visible !== false
    })
}
