import { BaseModel, belongsTo, column, beforeCreate  } from "@adonisjs/lucid/orm"
import { DateTime } from "luxon"
import type { BelongsTo } from "@adonisjs/lucid/types/relations"
import Chat from "#models/chat"
import User from "#models/user"
import { randomUUID } from "node:crypto"

export default class ChatInvite extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(model: ChatInvite) {
    model.id = randomUUID()
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // ---

  @column()
  declare chatId: string

  @column()
  declare userId: string

  @column()
  declare isAccepted: boolean | null

  // ---

  @belongsTo(() => Chat)
  declare chat: BelongsTo<typeof Chat>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
