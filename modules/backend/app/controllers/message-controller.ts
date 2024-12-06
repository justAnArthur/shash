import type { HttpContext } from '@adonisjs/core/http'
import Message from '#models/message'
import Chat from '#models/chat'
import emitter from '@adonisjs/core/services/emitter'
export default class MessageController {
  async byChat({ params, request, response }: HttpContext) {
    const { chat_id: chatId } = params
    const page = Number.parseInt(request.input('page', 1), 10) // Get page number, default to 1
    const perPage = 10 // Number of messages per page

    try {
      const messages = await Message.query()
        .where('chat_id', chatId)
        .preload('user', (query) => {
          query.select('nickname')
        })
        .orderBy('created_at', 'desc')
        .offset((page - 1) * perPage)
        .limit(perPage)

      const totalMessages = await Message.query().where('chat_id', chatId).count('* as total')
      const total = totalMessages[0]?.$extras?.total || 0

      // Map the messages to the desired format
      const formattedMessages = messages.map((message) => ({
        id: message.id,
        username: message.user.nickname,
        content: message.content,
        createdAt: message.createdAt.toISO(),
      }))

      return response.json({
        data: formattedMessages,
        meta: {
          total,
          perPage,
          currentPage: page,
          lastPage: Math.ceil(total / perPage),
        },
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Unable to fetch messages' })
    }
  }

  async sendMessage({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const { chatId, content } = request.only(['chatId', 'content'])

    // Step 1: Check if the user belongs to the chat
    const chat = await Chat.query()
      .where('id', chatId)
      .andWhereHas('users', (userQuery) => {
        userQuery.where('id', user.id)
      })
      .first()

    if (!chat) {
      return response.status(403).json({ error: 'User is not a member of this chat' })
    }

    // Step 2: Create and save the message in the database
    const message = await Message.create({
      userId: user.id,
      chatId,
      content,
    })

    // Step 3: Broadcast the message to others in the chat
    emitter.emit('chat:message', {
      chatId,
      message: {
        id: message.id,
        username: user.nickname,
        content: message.content,
        createdAt: message.createdAt.toISO(),
      },
    })

    return response.status(201).json({ success: true, message })
  }
}
