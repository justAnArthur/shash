import type { HttpContext } from '@adonisjs/core/http'
import Chat from "#models/chat"
import ChatInvite from "#models/chat-invite"
import User from "#models/user"

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

  async inviteToChat({ auth, request, response }: HttpContext) {
    try {
      const user = await auth.authenticate()

      const { userId: invitedUserId, chatId } = request.only(['userId', 'chatId'])

      const invitedUser = await User.findOrFail(invitedUserId)

      const chat = await Chat.findOrFail(chatId)

      const invite = await ChatInvite.create({
        chatId: chat.id,
        userId: invitedUser.id,
        createdByUserId: user.id,
        isAccepted: null
      })

      return response.ok({ message: 'User invited to the chat successfully', invite })
    } catch (error) {
      console.error(error)
      return response.internalServerError('Cannot invite user to the chat')
    }
  }

  async invitedChats({ auth, response }: HttpContext) {
    try {
      const user = await auth.authenticate()

      const invites = await ChatInvite.query()
        .where('user_id', user.id)
        // @ts-ignore
        .andWhere('is_accepted', null)
        .preload('chat')

      const chats = invites.map(invite => invite.chat)

      return response.ok(chats)
    } catch (error) {
      console.error(error)
      return response.internalServerError('Cannot retrieve invited chats')
    }
  }

  async acceptChatInvite({ auth, request, response }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const chatId = request.param('chat_id')

      const invite = await ChatInvite.query()
        .where('chat_id', chatId)
        .andWhere('user_id', user.id)
        // @ts-ignore
        .andWhere('is_accepted', null)
        .firstOrFail()

      invite.isAccepted = true
      await invite.save()

      await (await invite.related('chat').query().firstOrFail()).related('users').attach([user.id])

      return response.ok({ message: 'Chat invite accepted successfully' })
    } catch (error) {
      console.error(error)
      return response.internalServerError('Cannot accept chat invite')
    }
  }
}
