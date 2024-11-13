import type { HttpContext } from '@adonisjs/core/http'
import Chat from "#models/chat"
import ChatInvite from "#models/chat-invite"
import User from "#models/user"
import ChatKick from "#models/chat-kick"
import Message from "#models/message"
import ChatKicker from "#models/chat-kicker"

export default class ChatController {
  async byId({ request, response }: HttpContext) {
    try {
      const chatId = request.param('chat_id')

      const chat = await Chat.query().where('id', chatId).firstOrFail()

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

      if (search) query.where('channel_name', 'ilike', `%${search}%`)

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
          query.orderBy('created_at', 'desc').limit(1).preload('user')
        })

      const result = userChats.map((chat) => {
        const lastMessage = chat.messages[0] || null
        return {
          ...chat.serialize(),
          lastMessage: lastMessage ? lastMessage.serialize() : null,
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

      const kick = await ChatKick.query()
        .where('chat_id', chatId)
        .andWhere('user_id', user.id)
        .andWhere('is_closed', true)
        .andWhere('is_resolved', false)
        .first()

      if (kick) {
        return response.forbidden({ message: 'You have been kicked from this chat' })
      }

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
        userOwnerId: user.id,
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
        isAccepted: null,
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

      const chats = invites.map((invite) => invite.chat)

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

  async deleteOrQuit({ auth, request, response }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const chatId = request.param('chat_id')
      const { quit } = request.all()

      const chat = await Chat.findOrFail(chatId)

      // Check if the user is the owner of the chat
      if (chat.userOwnerId === user.id) {
        // If the user is the owner, delete the chat
        await chat.delete()
        return response.ok({ message: 'Chat deleted successfully' })
      }
      if (quit === 'true') return response.ok({ message: 'Cannot delete chat (not owner)' })
      // If the user is not the owner, remove them from the chat
      await chat.related('users').detach([user.id])

      return response.ok({ message: 'Successfully quit the chat' })
    } catch (error) {
      console.error(error)
      return response.internalServerError('Cannot perform the action')
    }
  }
  async getUsersByChat({ request, response }: HttpContext) {
    try {
      const chatId = request.param('chat_id')
      const { query } = request.qs()

      const chat = await Chat.findOrFail(chatId)

      await chat.load('users', (usersQuery) => {
        if (query) {
          usersQuery.where('nickname', 'ilike', `%${query}%`)
        }
      })

      return response.ok(chat.users)
    } catch (error) {
      console.error(error)
      return response.internalServerError('Cannot retrieve users from the chat')
    }
  }

  async leaveChat({ auth, request, response }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const chatId = request.param('chat_id')

      const chat = await Chat.findOrFail(chatId)
      await chat.related('users').detach([user.id])

      const usersCount = await chat.related('users').query().count('* as total')
      // @ts-ignore
      if (usersCount[0].total < 1) {
        await chat.delete()
      }

      return response.ok({ message: 'Successfully left the chat' })
    } catch (error) {
      console.error(error)
      return response.internalServerError('Cannot leave the chat')
    }
  }

  async destroyChat({ auth, request, response }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const chatId = request.param('chat_id')

      const chat = await Chat.findOrFail(chatId)

      if (chat.userOwnerId !== user.id) {
        return response.forbidden({ message: 'You are not the owner of this chat' })
      }

      await chat.delete()

      return response.ok({ message: 'Chat deleted successfully' })
    } catch (error) {
      console.error(error)
      return response.internalServerError('Cannot delete chat')
    }
  }

  async kickUser({ auth, request, response }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const { chatId, userId: kickingUserId } = request.only(['chatId', 'userId'])

      const chat = await Chat.findOrFail(chatId)

      let chatKick = await ChatKick.query()
        .where('chat_id', chatId)
        .andWhere('user_id', kickingUserId)
        .andWhere('is_closed', false)
        .first()

      if (!chatKick) {
        chatKick = await ChatKick.create({
          userId: kickingUserId,
          chatId,
          isClosed: false,
          isResolved: false
        })
      }

      await ChatKicker.create({
        chatKickId: chatKick.id,
        userId: user.id
      })

      if (chat.userOwnerId === user.id) {
        await this.kickRemoveUserFromChat(chat, kickingUserId)
        await ChatKick.query()
          .where('chat_id', chatId)
          .andWhere('user_id', kickingUserId)
          .andWhere('is_closed', false)
          .update({ isClosed: true })
        return response.ok({ message: 'User kicked from the chat by owner' })
      }

      const kickCount = await ChatKicker.query()
        .where('chat_kick_id', chatKick.id)
        .count('* as total')

      // @ts-ignore
      if (kickCount[0].total >= 3) {
        await this.kickRemoveUserFromChat(chat, kickingUserId)
        await ChatKick.query()
          .where('chat_id', chatId)
          .andWhere('user_id', kickingUserId)
          .andWhere('is_closed', false)
          .update({ isClosed: true })
        return response.ok({ message: 'User kicked from the chat by votes' })
      }

      return response.ok({ message: 'Kick vote registered' })
    } catch (error) {
      console.error(error)
      return response.internalServerError('Cannot kick user from the chat')
    }
  }

  async resolveKick({ auth, request, response }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const { chatId, userId } = request.only(['chatId', 'userId'])

      const chat = await Chat.findOrFail(chatId)

      if (chat.userOwnerId !== user.id) {
        return response.forbidden({ message: 'Only the chat owner can resolve kicks' })
      }

      const kicks = await ChatKick.query()
        .where('chat_id', chatId)
        .andWhere('user_id', userId)
        .andWhere('is_closed', true)
        .andWhere('is_resolved', false)

      if (kicks.length === 0) {
        return response.notFound({ message: 'No active kicks found for this user in the chat' })
      }

      for (const kick of kicks) {
        kick.isResolved = true
        kick.isClosed = true
        await kick.save()
      }

      return response.ok({ message: 'All kicks resolved successfully' })
    } catch (error) {
      console.error(error)
      return response.internalServerError('Cannot resolve kicks')
    }
  }

  private async kickRemoveUserFromChat(chat: Chat, userId: string) {
    await chat.related('users').detach([userId])

    await ChatKick.query()
      .where('chat_id', chat.id)
      .andWhere('user_id', userId)
      .andWhere('is_closed', false)
      .update({ isClosed: true })

    await Message.create({
      chatId: chat.id,
      userId: chat.userOwnerId,
      content: `User with ID ${userId} was removed from the chat.`
    })
  }
}
