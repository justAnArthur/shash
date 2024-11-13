import { BaseSchema } from "@adonisjs/lucid/schema"

export default class AddIsResolvedToChatKicks extends BaseSchema {
  protected tableName = 'chat_kicks'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_resolved').defaultTo(false).notNullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('is_resolved')
    })
  }
}
