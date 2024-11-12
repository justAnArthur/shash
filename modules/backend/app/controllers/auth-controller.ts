import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    console.log(request.all())
    const payload = await request.validateUsing(registerValidator)

    const user = await User.create(payload)

    return response.created(user)
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    console.log('hello', email, password)
    const user = await User.verifyCredentials(email, password)

    const token = await User.accessTokens.create(user)
    return response.ok({
      token: token.toJSON().token,
      user: user.serialize()
    })
  }

  async logout({ auth, response }: HttpContext) {
    await auth.authenticate()
    const user = auth.getUserOrFail()
    console.log(user)
    const token = user.currentAccessToken
    if (!token) {
      return response.badRequest({ message: 'Token not found' })
    }
    await User.accessTokens.delete(user, token.identifier)
    return response.ok({ message: 'Logged out' })
  }
}
