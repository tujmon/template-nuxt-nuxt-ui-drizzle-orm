import { BaseService } from './base'
import { user } from '../database/schema/auth'
import { eq } from 'drizzle-orm'
import { updateProfileSchema, type UpdateProfileInput } from '../../shared/validation/auth'
import { logger } from '../utils/logger'

export class UserService extends BaseService {
  async findById(id: string) {
    logger.debug({ userId: id }, 'Querying database for user by ID')
    const results = await this.db.select().from(user).where(eq(user.id, id)).limit(1)
    return results[0] || null
  }

  async updateProfile(id: string, data: UpdateProfileInput) {
    logger.info({ userId: id, updatedKeys: Object.keys(data) }, 'Initiating user profile update in database')
    const validatedData = updateProfileSchema.parse(data)
    const updateData: Partial<typeof user.$inferInsert> = {
      updatedAt: new Date()
    }
    if (validatedData.name) updateData.name = validatedData.name
    if (validatedData.email) updateData.email = validatedData.email

    await this.db.update(user).set(updateData).where(eq(user.id, id))
    return this.findById(id)
  }
}

export const userService = new UserService()

