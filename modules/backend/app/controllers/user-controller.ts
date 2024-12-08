import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UserController {
  async queryUsers({ request, response }: HttpContext) {
    try {
      const query = request.param('query')

      const users = await User.query()
        .where('nickname', 'ilike', `%${query}%`)
        .orWhere('email', 'ilike', `%${query}%`)
        .orWhere('name', 'ilike', `%${query}%`)
        .orWhere('surname', 'ilike', `%${query}%`)
        .limit(10)

      console.log(
        User.query()
          .where('nickname', 'ilike', `%${query}%`)
          .orWhere('email', 'ilike', `%${query}%`)
          .orWhere('name', 'ilike', `%${query}%`)
          .orWhere('surname', 'ilike', `%${query}%`)
          .limit(10)
          .toSQL()
      )

      return response.ok(users)
    } catch (error) {
      console.error(error)
      return response.internalServerError('Cannot retrieve users')
    }
  }

  async getUsersByChatId({ request, response }: HttpContext) {
    try {
      const chatId = request.param('chat_id')

      const users = await User.query()
        .join('user_chats', 'users.id', 'user_chats.user_id')
        .where('user_chats.chat_id', chatId)
        .select('users.*')

      return response.ok(users)
    } catch (error) {
      console.error(error)
      return response.internalServerError('Cannot retrieve users for the chat')
    }
  }

  async setStatus({ auth, request, response }: HttpContext) {
    try {
      await auth.authenticate()

      const user = auth.getUserOrFail()
      const id = user.id

      const notificationStatus = request.body().status
      if (!['ONLINE', 'OFFLINE', 'DND'].includes(notificationStatus)) {
        return response.badRequest('Notification status is required.')
      }

      await User.query() // @ts-ignore
        .update({ notificationStatus: String(notificationStatus) })
        .where('id', id)

      return response.ok({ message: 'Notification status updated successfully.' })
    } catch (error) {
      console.error('Error updating notification status:', error)

      return response.internalServerError('Cannot update notification status.')
    }
  }

  async setNotifyOnlyWhenTaggedStatus({ auth, request, response }: HttpContext) {
    try {
      await auth.authenticate()

      const user = auth.getUserOrFail()
      const id = user.id

      const notifyWhenTagged = request.body().status
      if (notifyWhenTagged === undefined) {
        return response.badRequest('Notify only when tagged status is required.')
      }

      await User.query() // @ts-ignore
        .update({ notifyWhenTagged })
        .where('id', id)

      return response.ok({ message: 'Notify only when tagged status updated successfully.' })
    } catch (error) {
      console.error('Error updating notify only when tagged status:', error)

      return response.internalServerError('Cannot update notify only when tagged status.')
    }
  }

  async getMe({ auth, response }: HttpContext) {
    try {
      await auth.authenticate()

      const user = auth.getUserOrFail()

      return response.ok(user)
    } catch (error) {
      console.error('Error retrieving user:', error)

      return response.internalServerError('Cannot retrieve user.')
    }
  }
}
