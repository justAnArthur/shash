import { BaseSchema } from "@adonisjs/lucid/schema"

export default class CreateChatInvitesUpdatedAtsTable extends BaseSchema {
  protected tableName = 'chat_invites'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('updated_at')
    })
  }
}
