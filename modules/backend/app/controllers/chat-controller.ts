import type { HttpContext } from '@adonisjs/core/http'
import Chat from "#models/chat"

export default class ChatController {
  async byId({ request, response }: HttpContext) {
    try {
      const chatId = request.param('chat_id')

      const chat = await Chat.query()
        .where('id', chatId)
        .firstOrFail()

      return response.ok(chat)
    } catch (error) {
      console.error(error)
      return response.notFound()
    }
  }

  async publicChats({ request, response }: HttpContext) {
    try {
      const { search } = request.qs()

      const query = Chat.query().where('is_private', false)

      if (search)
        query.where('channel_name', 'ilike', `%${search}%`)

      const publicChats = await query

      return response.ok(publicChats)
    } catch (error) {
      console.error(error)
      return response.internalServerError('Cannot retrieve public chats')
    }
  }

  async mineChats({ auth, response }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const userChats = await Chat.query()
        .whereHas('users', (query) => {
          query.where('user_id', user.id)
        })
        .preload('messages', (query) => {
          query.orderBy('created_at', 'desc').limit(1)
        })

      const result = userChats.map(chat => {
        const lastMessage = chat.messages[0] || null
        return {
          ...chat.serialize(),
          lastMessage: lastMessage ? lastMessage.serialize() : null
        }
      })

      return response.ok(result)
    } catch (error) {

      console.error(error)
      return response.internalServerError('Cannot retrieve user chats')
    }
  }

  async joinChat({ auth, request, response }: HttpContext) {
    try {
      const user = await auth.authenticate()

      const chatId = request.param('chat_id')

      const chat = await Chat.findOrFail(chatId)
      await chat.related('users').attach([user.id])

      return response.ok({ message: 'Successfully joined the chat' })
    } catch (error) {
      console.error(error)
      return response.internalServerError('Cannot join the chat')
    }
  }

  async createChat({ auth, request, response }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const { chatName, isPrivate } = request.only(['chatName', 'isPrivate'])

      const chat = await Chat.create({
        channelName: chatName,
        isPrivate: isPrivate,
        userOwnerId: user.id
      })

      await chat.related('users').attach([user.id])

      return response.created({ message: 'Chat created successfully', chat })
    } catch (error) {
      console.error(error)
      return response.internalServerError('Cannot create chat')
    }
  }
}
