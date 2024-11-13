import cron from 'node-cron'
import { DateTime } from 'luxon'
import Chat from '#models/chat'

async function deleteInactiveChats() {
  const chats = await Chat.query().preload('messages')

  for (const chat of chats) {
    const lastMessage = chat.messages[chat.messages.length - 1]

    if (lastMessage) {
      const lastMessageDate = lastMessage.createdAt
      const daysSinceLastMessage = DateTime.local().diff(lastMessageDate, 'days').days

      if (daysSinceLastMessage > 30) {
        await chat.delete()
        console.log(`Chat with ID ${chat.id} has been deleted due to inactivity.`)
      }
    }
  }
}

cron.schedule('0 0 * * *', deleteInactiveChats) // Runs daily at midnight

export default deleteInactiveChats
