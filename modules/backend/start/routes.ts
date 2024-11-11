/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router.post('register', [AuthController, 'register'])
    router.post('login', [AuthController, 'login'])
    router.post('logout', [AuthController, 'logout'])
  })
  .prefix('user')

// NOTE: This is how we define protected routes by adding `.use(middleware.auth({ guards: ['api'] }))`
router
  .get('me', async ({ auth, response }) => {
    response.ok(auth.user)
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
