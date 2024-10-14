import { BaseModel, belongsTo, column, hasMany, manyToMany, beforeCreate  } from "@adonisjs/lucid/orm"
import { DateTime } from "luxon"
import type { BelongsTo, HasMany, ManyToMany } from "@adonisjs/lucid/types/relations"
import ChatBan from "#models/chat-ban"
import ChatKick from "#models/chat-kick"
import ChatInvite from "#models/chat-invite"
import Message from "#models/message"
import User from "#models/user"
import { randomUUID } from "node:crypto"

export default class Chat extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(model: Chat) {
    model.id = randomUUID()
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // ---

  @column()
  declare userOwnerId: string

  @column()
  declare channelName: string

  @column()
  declare isPrivate: boolean

  // ---

  // Owner of the chat
  @belongsTo(() => User, {
    foreignKey: 'userOwnerId'
  })
  declare owner: BelongsTo<typeof User>

  // Users in the chat
  @manyToMany(() => User, {
    pivotTable: 'user_chats',
    pivotForeignKey: 'chat_id',
    pivotRelatedForeignKey: 'user_id'
  })
  declare users: ManyToMany<typeof User>

  // Messages in the chat
  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>

  // Invites for the chat
  @hasMany(() => ChatInvite)
  declare invites: HasMany<typeof ChatInvite>

  // Kicks in the chat
  @hasMany(() => ChatKick)
  declare kicks: HasMany<typeof ChatKick>

  // Bans in the chat
  @hasMany(() => ChatBan)
  declare bans: HasMany<typeof ChatBan>
}
