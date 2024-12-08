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
// This path exists only to show that deleteFunc actually deletes chats when they are older than 30 days.
// @ts-ignore
import deleteFunc from './scheduler.ts'

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
        router.delete('invite/reject/:chat_id', [ChatController, 'rejectChatInvite'])
        router.delete(':chat_id', [ChatController, 'deleteOrQuit'])
        router.get(':chat_id/users', [ChatController, 'getUsersByChat'])
        router.post('leave/:chat_id', [ChatController, 'leaveChat'])
        router.delete('destroy/:chat_id', [ChatController, 'destroyChat'])
        router.post('kick', [ChatController, 'kickUser'])
        router.post('kick/resolve', [ChatController, 'resolveKick'])
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
        router.get('byChat/:chat_id', [UserController, 'getUsersByChatId'])
        router.post('notifications', [UserController, 'setStatus'])
      })
      .prefix('user')
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

router.get('/delete-old-chats', async () => {
  deleteFunc()
})
