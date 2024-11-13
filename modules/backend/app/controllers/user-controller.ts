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
}
