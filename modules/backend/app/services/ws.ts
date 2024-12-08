import { Server } from 'socket.io'
import server from '@adonisjs/core/services/server'

class Ws {
  io: Server | undefined
  private booted = false

  boot() {
    if (this.booted) {
      return
    }

    this.booted = true
    this.io = new Server(server.getNodeServer(), {
      cors: {
        origin: '*',
      },
    })

    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      socket.on('join:room', (chatId: string) => {
        socket.join(chatId)
        console.log(`User ${socket.id} joined room ${chatId}`)

        socket.to(chatId).emit('user:joined', {
          userId: socket.id,
          timestamp: new Date(),
        })
      })

      socket.on('chat:typing', (data: { chatId: string; content: string; username: string }) => {
        console.log(socket.id)
        socket.to(data.chatId).emit('chat:typing', {
          chatId: data.chatId,
          content: data.content,
          username: data.username,
        })
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })
  }
}

export default new Ws()
