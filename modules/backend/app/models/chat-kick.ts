import { BaseModel, beforeCreate, belongsTo, column, hasMany } from "@adonisjs/lucid/orm"
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations"
import ChatKicker from "#models/chat-kicker"
import User from "#models/user"
import Chat from "#models/chat"
import { randomUUID } from "node:crypto"

export default class ChatKick extends BaseModel {
  @column({ isPrimary: true })
  declare id: string // UUID

  @beforeCreate()
  static assignUuid(model: ChatKick) {
    model.id = randomUUID()
  }

  @column()
  declare chatId: string

  @column()
  declare userId: string // User being kicked

  @column()
  declare isClosed: boolean

  @column()
  declare isResolved: boolean

  // Relationships

  @belongsTo(() => Chat)
  declare chat: BelongsTo<typeof Chat>

  @belongsTo(() => User, {
    foreignKey: 'userId'
  })
  declare kickedUser: BelongsTo<typeof User>

  @hasMany(() => ChatKicker)
  declare chatKickers: HasMany<typeof ChatKicker>
}
