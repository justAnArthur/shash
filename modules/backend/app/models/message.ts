import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Chat from '#models/chat'
import { randomUUID } from 'node:crypto'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(model: Message) {
    model.id = randomUUID()
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // ---

  @column()
  declare userId: string // Foreign key to User

  @column()
  declare chatId: string // Foreign key to Chat

  @column()
  declare content: string

  // ---

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Chat)
  declare chat: BelongsTo<typeof Chat>
}
