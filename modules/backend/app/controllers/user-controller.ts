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
      // Authenticate the user
      await auth.authenticate()

      // Retrieve the authenticated user
      const user = auth.getUserOrFail()
      const id = user.id

      // Ensure request body contains the expected notification status
      const notificationStatus = request.body().status
      if (!['ONLINE', 'OFFLINE', 'DND'].includes(notificationStatus)) {
        return response.badRequest('Notification status is required.')
      }
      const notifications = {
        ONLINE: 'ONLINE',
        OFFLINE: 'NULL',
        DND: 'DISABLED',
      }
      // Update the user's notification status
      await User.query()
        .update({ notificationStatus: String(notifications[notificationStatus]) })
        .where('id', id)

      // Respond with success message
      return response.ok({ message: 'Notification status updated successfully.' })
    } catch (error) {
      console.error('Error updating notification status:', error)

      // Respond with a more specific error message
      return response.internalServerError('Cannot update notification status.')
    }
  }
}
