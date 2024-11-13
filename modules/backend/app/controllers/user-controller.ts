import type { HttpContext } from '@adonisjs/core/http'
import User from "#models/user"

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

      console.log(User.query()
        .where('nickname', 'ilike', `%${query}%`)
        .orWhere('email', 'ilike', `%${query}%`)
        .orWhere('name', 'ilike', `%${query}%`)
        .orWhere('surname', 'ilike', `%${query}%`)
        .limit(10).toSQL())

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
}
