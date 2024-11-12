import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(64),
    surname: vine.string().minLength(3).maxLength(64),
    email: vine
      .string()
      .email()
      .unique(async (query, field) => {
        const user = await query.from('users').where('email', field).first()
        return !user
      }),
    nickname: vine.string().unique(async (query, field) => {
      const user = await query.from('users').where('nickname', field).first()
      return !user
    }),
    password: vine.string().minLength(4).maxLength(32),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(4).maxLength(32),
  })
)
