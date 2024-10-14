/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from "#start/kernel"

// router.get('/', async () => {
//   return {
//     hello: 'world'
//   }
// })

// user
const UsersController = () => import('#controllers/user')

console.log('UsersController', UsersController())

router.post('/users/register', [UsersController, 'register'])

router.post('/users/login', [UsersController, 'login'])

router.get('/users/:id', [UsersController, 'show']).middleware(middleware.auth())

router.put('/users/:id', [UsersController, 'update']).middleware(middleware.auth())

router.delete('/users/:id', [UsersController, 'destroy']).middleware(middleware.auth())

// router.get('/users', 'UsersController.index').middleware(['auth', 'isAdmin'])
