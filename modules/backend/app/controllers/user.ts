import hash from '@adonisjs/core/services/hash'
import User from "#models/user"

export default class UsersController {
  // User Registration
  public async register({ request, response }: HttpContextContract) {
    // Validate request data
    const data = await request.validate({
      schema: schema.create({
        email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
        nickname: schema.string({}, [rules.unique({ table: 'users', column: 'nickname' })]),
        password: schema.string({}, [rules.minLength(6)]),
        name: schema.string.optional(),
        surname: schema.string.optional()
      })
    })

    // Create new user
    const user = await User.create({
      email: data.email,
      nickname: data.nickname,
      passwordHash: await Hash.make(data.password),
      name: data.name,
      surname: data.surname,
      notificationStatus: 'ENABLED' // Default value
    })

    return response.created({ user })
  }

  // User Login
  public async login({ auth, request, response, logger }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await User.verifyCredentials(email, password)


      const token = await auth.use('api').attempt(email, password)
      return response.ok({ token })
    } catch (e) {
      console.warn(e)
      return response.unauthorized('Invalid credentials')
    }
  }

  // Get User Profile
  public async show({ params, auth, response }: HttpContextContract) {
    // Ensure the authenticated user is requesting their own profile or has admin rights
    if (auth.user?.id !== params.id && !auth.user?.isAdmin) {
      return response.unauthorized('You do not have permission to view this profile')
    }

    const user = await User.findOrFail(params.id)
    return response.ok({ user })
  }

  // Update User Profile
  public async update({ params, request, auth, response }: HttpContextContract) {
    // Ensure the authenticated user is updating their own profile or has admin rights
    if (auth.user?.id !== params.id && !auth.user?.isAdmin) {
      return response.unauthorized('You do not have permission to update this profile')
    }

    const user = await User.findOrFail(params.id)

    // Validate request data
    const data = await request.validate({
      schema: schema.create({
        email: schema.string.optional({}, [rules.email(), rules.unique({
          table: 'users',
          column: 'email',
          whereNot: { id: user.id }
        })]),
        nickname: schema.string.optional({}, [rules.unique({
          table: 'users',
          column: 'nickname',
          whereNot: { id: user.id }
        })]),
        password: schema.string.optional({}, [rules.minLength(6)]),
        name: schema.string.optional(),
        surname: schema.string.optional(),
        notificationStatus: schema.enum.optional(['ENABLED', 'DISABLED'] as const)
      })
    })

    // Update user fields
    if (data.password) {
      data.passwordHash = await Hash.make(data.password)
      delete data.password
    }

    user.merge(data)
    await user.save()

    return response.ok({ user })
  }

  // Delete User
  public async destroy({ params, auth, response }: HttpContextContract) {
    // Ensure the authenticated user is deleting their own account or has admin rights
    if (auth.user?.id !== params.id && !auth.user?.isAdmin) {
      return response.unauthorized('You do not have permission to delete this account')
    }

    const user = await User.findOrFail(params.id)
    await user.delete()

    return response.ok({ message: 'User deleted successfully' })
  }

  // List All Users
  public async index({ response }: HttpContextContract) {
    const users = await User.all()
    return response.ok({ users })
  }
}
