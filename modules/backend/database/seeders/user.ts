import User from "#models/user"
import Chat from "#models/chat"
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import hash from '@adonisjs/core/services/hash'

export default class UserChatSeeder extends BaseSeeder {
  public async run() {
    const user1 = await User.create({
      name: 'User',
      surname: '1',
      nickname: 'user1',
      email: 'user1@user.user',
      password: await hash.make('user1'),
      notificationStatus: 'ENABLED'
    })

    const user2 = await User.create({
      name: 'User',
      surname: '2',
      nickname: 'user2',
      email: 'user2@user.user',
      password: await hash.make('user2'),
      notificationStatus: 'ENABLED'
    })

    const chat = await Chat.create({
      userOwnerId: user1.id,
      channelName: 'Shared chat',
      isPrivate: false
    })

    await chat.related('users').attach([user1.id, user2.id])

    console.log('Seeded two users with one chat!')
  }
}
