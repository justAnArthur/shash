import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddImageToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('image').nullable()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('image')
    })
  }
}
