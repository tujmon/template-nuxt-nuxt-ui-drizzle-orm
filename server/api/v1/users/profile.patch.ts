import { updateProfileSchema } from '~~/shared/validation/auth'
import { userService } from '~~/server/services/user'
import { auth } from '~~/server/utils/auth'
import { assertRateLimit } from '~~/server/utils/rate-limit'
import { useLogger } from '~~/server/utils/logger'

export default defineEventHandler(async (event) => {
  const loggerInstance = useLogger(event)

  assertRateLimit(event, {
    keyPrefix: 'profile:update'
  })

  const session = await auth.api.getSession({
    headers: toWebRequest(event).headers
  })

  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Autenticação necessária'
    })
  }

  // Set userId in event context so middleware response logger can access it
  event.context.userId = session.user.id

  const body = await readBody(event)
  const result = updateProfileSchema.safeParse(body)

  if (!result.success) {
    loggerInstance.warn({ errors: result.error.format() }, 'Validation failed on profile update')
    throw createError({
      statusCode: 400,
      message: 'Dados de entrada inválidos',
      data: result.error.format()
    })
  }

  try {
    const updatedUser = await userService.updateProfile(session.user.id, result.data)
    loggerInstance.info({ updatedFields: Object.keys(result.data) }, 'Profile updated successfully')

    return {
      success: true,
      user: updatedUser
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno ao atualizar perfil'
    const isValidationError = message === 'Informe pelo menos um campo para atualizar' || 
                              message.includes('E-mail inválido')

    throw createError({
      statusCode: isValidationError ? 400 : 500,
      message
    })
  }
})
