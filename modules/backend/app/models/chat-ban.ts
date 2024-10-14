import { BaseModel, belongsTo, column ,beforeCreate } from "@adonisjs/lucid/orm"
import { DateTime } from "luxon"
import Chat from "#models/chat"
import User from "#models/user"
import type { BelongsTo } from "@adonisjs/lucid/types/relations"
import ChatKick from "#models/chat-kick"
import { randomUUID } from "node:crypto"

export default class ChatBan extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(model: ChatBan) {
    model.id = randomUUID()
  }

  @column()
  declare chatId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime()
  declare refreshedAt: DateTime

  // ---

  @column()
  declare userId: string // Banned user

  @column()
  declare chatKickId: string

  // ---

  @belongsTo(() => Chat)
  declare chat: BelongsTo<typeof Chat>

  @belongsTo(() => User, {
    foreignKey: 'userId'
  })
  declare bannedUser: BelongsTo<typeof User>

  @belongsTo(() => ChatKick)
  declare chatKick: BelongsTo<typeof ChatKick>
}
