import type { HttpContext } from "@adonisjs/core/http"
import Message from "#models/message"

export default class MessageController {
  public async byChat({ params, response }: HttpContext) {
    const { chat_id } = params

    try {
      const messages = await Message.query()
        .where('chat_id', chat_id)
        .orderBy('created_at', 'desc')

      return response.json(messages)
    } catch (error) {
      return response.status(500).json({ error: 'Unable to fetch messages' })
    }
  }
}
