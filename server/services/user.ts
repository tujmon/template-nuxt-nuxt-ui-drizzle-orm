import { validateUserEmail } from '../domain/user/entity'
import type { UserRepository } from '../domain/user/repository'
import { drizzleUserRepository } from '../infrastructure/repositories/user.repository'
import { logger } from '../utils/logger'
import { BaseService } from './base'

export class UserService extends BaseService {
  private userRepository: UserRepository

  constructor(userRepository: UserRepository = drizzleUserRepository) {
    super()
    this.userRepository = userRepository
  }

  async findById(id: string) {
    logger.debug({ userId: id }, 'Querying database for user by ID')
    return this.userRepository.findById(id)
  }

  async updateProfile(id: string, data: { name?: string; email?: string }) {
    logger.info(
      { userId: id, updatedKeys: Object.keys(data) },
      'Initiating user profile update in database'
    )

    if (data.name === undefined && data.email === undefined) {
      throw new Error('Informe pelo menos um campo para atualizar')
    }

    if (data.email) {
      if (!validateUserEmail(data.email)) {
        throw new Error('E-mail inválido de acordo com as regras de domínio')
      }
    }

    return this.userRepository.update(id, data)
  }
}

export const userService = new UserService()
