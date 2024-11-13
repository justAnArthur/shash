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

    // Handle chat events
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      // Handle joining a room
      socket.on('join:room', (chatId: string) => {
        socket.join(chatId)
        console.log(`User ${socket.id} joined room ${chatId}`)

        // Notify room about new user
        socket.to(chatId).emit('user:joined', {
          userId: socket.id,
          timestamp: new Date(),
        })
      })

      //// Handle chat messages
      //socket.on('chat:message', (data) => {
      //  console.log('Message received: ', data)
      //  // Broadcast to room including myself
      //
      //  this.io?.to(data.chatId).emit('chat:message', data)
      //})

      //// Handle typing status
      //socket.on('user:typing', (data: { chatId: string; isTyping: boolean }) => {
      //  socket.to(data.chatId).emit('user:typing', {
      //    userId: socket.id,
      //    isTyping: data.isTyping,
      //  })
      //})

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })
  }
}

export default new Ws()
