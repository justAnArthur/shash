import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddCreatedByUserToChatInvites extends BaseSchema {
  protected tableName = 'chat_invites'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.uuid('created_by_user_id').after('user_id').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('created_by_user_id')
    })
  }
}
