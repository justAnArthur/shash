import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'
  protected columnName = 'notify_when_tagged'

  async up() {
    this.schema.table(this.tableName, (table) => {
      table.string(this.columnName).nullable()
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn(this.columnName)
    })
  }
}
