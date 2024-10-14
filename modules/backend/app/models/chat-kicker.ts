import { BaseModel, belongsTo, column, beforeCreate  } from "@adonisjs/lucid/orm"
import { DateTime } from "luxon"
import type { BelongsTo } from "@adonisjs/lucid/types/relations"
import ChatKick from "#models/chat-kick"
import User from "#models/user"
import { randomUUID } from "node:crypto"

export default class ChatKicker extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(model: ChatKicker) {
    model.id = randomUUID()
  }

  @column()
  declare chatKickId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column()
  declare userId: string // User who initiated the kick

  // Relationships

  @belongsTo(() => ChatKick)
  declare chatKick: BelongsTo<typeof ChatKick>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
