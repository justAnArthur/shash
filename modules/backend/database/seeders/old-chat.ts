import User from '#models/user'
import { DateTime } from 'luxon'
import Message from '#models/message'
import Chat from '#models/chat'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class OldChat extends BaseSeeder {
  public async run() {
    // Check if the user exists, otherwise create a new one
    let user = await User.query().where('email', 'user5@user.user').first()

    if (!user) {
      user = await User.create({
        name: 'User',
        surname: '3',
        nickname: 'user5',
        email: 'user5@user.user',
        password: 'user3',
        // @ts-ignore
        notificationStatus: 'ENABLED',
      })
    }

    // Check if the "Old Chat" already exists
    let chat = await Chat.query()
      .where('channelName', 'Old Chat')
      .andWhere('userOwnerId', user.id)
      .first()

    if (!chat) {
      console.log('Creating old chat')
      chat = await Chat.create({
        userOwnerId: user.id,
        channelName: 'Old Chat',
        isPrivate: false,
      })
    }

    // Create the old message only if it doesn't exist
    await Message.firstOrCreate(
      {
        chatId: chat.id,
        userId: user.id,
        content: 'Old message',
      },
      {
        createdAt: DateTime.local().minus({ days: 31 }),
      }
    )

    // Check if the "Active Chat" already exists
    let recentChat = await Chat.query()
      .where('channelName', 'Active Chat')
      .andWhere('userOwnerId', user.id)
      .first()

    if (!recentChat) {
      recentChat = await Chat.create({
        userOwnerId: user.id,
        channelName: 'Active Chat',
        isPrivate: false,
      })
    }

    // Create the recent message only if it doesn't exist
    await Message.firstOrCreate(
      {
        chatId: recentChat.id,
        userId: user.id,
        content: 'Recent message',
      },
      {
        createdAt: DateTime.local(),
      }
    )

    console.log('Seeded old and recent chats')
  }
}
