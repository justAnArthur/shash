import emitter from '@adonisjs/core/services/emitter'
import ws from '#services/ws'

// @ts-ignore
emitter.on('chat:message', ({ chatId, message }) => {
  ws.io?.to(chatId).emit('chat:message', { chatId, ...message })
})
