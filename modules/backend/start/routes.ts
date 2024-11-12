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

const AuthController = () => import('#controllers/auth-controller')
router
  .group(() => {
    router.post('register', [AuthController, 'register'])
    router.post('login', [AuthController, 'login'])
    router.post('logout', [AuthController, 'logout'])
  })
  .prefix('user')

router.group(() => {
  const ChatController = () => import('#controllers/chat-controller')
  router
    .group(() => {
      router.get('byId/:chat_id', [ChatController, 'byId'])
      router.get('public', [ChatController, 'publicChats'])
      router.get('mine', [ChatController, 'mineChats'])
      router.post('join/:chat_id', [ChatController, 'joinChat'])
      router.put('create', [ChatController, 'createChat'])
    })
    .prefix('chat')

  const MessageController = () => import('#controllers/message-controller')
  router
    .group(() => {
      router.get('byChat/:chat_id', [MessageController, 'byChat'])
    })
    .prefix('message')
})
  .use(
    middleware.auth({
      guards: ['api']
    })
  )
