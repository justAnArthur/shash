import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddNotificationStatusConstraints extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.raw(`
      ALTER TABLE ${this.tableName}
      DROP CONSTRAINT IF EXISTS users_notification_status_check;

      ALTER TABLE ${this.tableName}
      ADD CONSTRAINT users_notification_status_check
      CHECK (notification_status = ANY (ARRAY['ONLINE', 'DND', 'OFFLINE']));
    `)
  }

  async down() {
    this.schema.raw(`
      ALTER TABLE ${this.tableName}
      DROP CONSTRAINT IF EXISTS users_notification_status_check;
    `)
  }
}
