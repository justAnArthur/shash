import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeCreate, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { HasMany, ManyToMany } from "@adonisjs/lucid/types/relations"
import ChatInvite from "#models/chat-invite"
import Message from "#models/message"
import Chat from "#models/chat"
import ChatKicker from "#models/chat-kicker"
import ChatBan from "#models/chat-ban"
import ChatKick from "#models/chat-kick"
import { randomUUID } from "node:crypto"

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password'
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(user: User) {
    user.id = randomUUID()
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // ---

  @column()
  declare name: string | null

  @column()
  declare surname: string | null

  @column()
  declare nickname: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare notificationStatus: 'ONLINE' | 'DISABLED' | 'NULL' // 'online', 'dnd', 'offline'

  // ---

  // Chats owned by the user
  @hasMany(() => Chat, {
    foreignKey: 'userOwnerId'
  })
  declare ownedChats: HasMany<typeof Chat>

  // Chats the user participates in
  @manyToMany(() => Chat, {
    pivotTable: 'user_chats',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'chat_id'
  })
  declare chats: ManyToMany<typeof Chat>

  // Messages sent by the user
  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>

  // Invites received by the user
  @hasMany(() => ChatInvite)
  declare receivedInvites: HasMany<typeof ChatInvite>

  // Kicks where the user is being kicked
  @hasMany(() => ChatKick, {
    foreignKey: 'userId'
  })
  declare kicksReceived: HasMany<typeof ChatKick>

  // Kicks performed by the user
  @hasMany(() => ChatKicker, {
    foreignKey: 'userId'
  })
  declare kicksPerformed: HasMany<typeof ChatKicker>

  // Bans where the user is banned
  @hasMany(() => ChatBan, {
    foreignKey: 'userId'
  })
  declare bans: HasMany<typeof ChatBan>

  // ---

  async run() {

  }
}
