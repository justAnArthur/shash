import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())

      table.string('nickname').notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()

      table.string('name').nullable()
      table.string('surname').nullable()

      table.enum('notification_status', ['ENABLED', 'DISABLED']).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      this.schema.dropTable(this.tableName)
    })
  }
}
