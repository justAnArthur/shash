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

router
  .group(() => {
    const ChatController = () => import('#controllers/chat-controller')
    router
      .group(() => {
        router.get('byId/:chat_id', [ChatController, 'byId'])
        router.get('public', [ChatController, 'publicChats'])
        router.get('mine', [ChatController, 'mineChats'])
        router.post('join/:chat_id', [ChatController, 'joinChat'])
        router.put('create', [ChatController, 'createChat'])
        router.post('invite', [ChatController, 'inviteToChat'])
        router.get('invites', [ChatController, 'invitedChats'])
        router.post('invite/accept/:chat_id', [ChatController, 'acceptChatInvite'])
        router.delete(':chat_id', [ChatController, 'deleteOrQuit'])
      })
      .prefix('chat')

    const MessageController = () => import('#controllers/message-controller')
    router
      .group(() => {
        router.get('byChat/:chat_id', [MessageController, 'byChat'])
        router.post('send', [MessageController, 'sendMessage'])
      })
      .prefix('message')

    const UserController = () => import('#controllers/user-controller')
    router
      .group(() => {
        router.get('byQuery/:query', [UserController, 'queryUsers'])
      })
      .prefix('user')
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
// This path exists only to show that deleteFunc actually deletes chats when they are older than 30 days.
import deleteFunc from './scheduler.ts'
router.get('/delete-old-chats', async () => {
  deleteFunc()
})
