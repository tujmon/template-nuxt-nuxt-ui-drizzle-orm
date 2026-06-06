import { ZodError } from 'zod'
import { updateProfileSchema } from '~~/shared/validation/auth'
import { UserService } from '~~/server/services/user'
import { auth } from '~~/server/utils/auth'
import { assertRateLimit } from '~~/server/utils/rate-limit'

export default defineEventHandler(async (event) => {
  assertRateLimit(event, {
    keyPrefix: 'profile:update'
  })

  assertMethod(event, 'PATCH')

  const session = await auth.api.getSession({
    headers: toWebRequest(event).headers
  })

  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Autenticação necessária'
    })
  }

  const body = await readBody(event)
  const result = updateProfileSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Dados de entrada inválidos',
      data: result.error.format()
    })
  }

  const userService = new UserService()

  try {
    const updatedUser = await userService.updateProfile(session.user.id, result.data)

    return {
      success: true,
      user: updatedUser
    }
  } catch (error) {
    if (error instanceof ZodError) {
      throw createError({
        statusCode: 400,
        message: 'Dados de entrada inválidos',
        data: error.format()
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Erro interno ao atualizar perfil'
    })
  }
})
