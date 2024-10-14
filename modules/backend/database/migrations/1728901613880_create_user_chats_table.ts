import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_chats'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.uuid('chat_id').notNullable().references('id').inTable('chats').onDelete('CASCADE')
      table.primary(['user_id', 'chat_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
