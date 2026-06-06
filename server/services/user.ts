import { BaseService } from './base'
import { user } from '../database/schema/auth'
import { eq } from 'drizzle-orm'
import type { UpdateProfileInput } from '../../shared/validation/auth'

export class UserService extends BaseService {
  async findById(id: string) {
    const results = await this.db.select().from(user).where(eq(user.id, id)).limit(1)
    return results[0] || null
  }

  async updateProfile(id: string, data: UpdateProfileInput) {
    const updateData: Partial<typeof user.$inferInsert> = {
      updatedAt: new Date()
    }
    if (data.name) updateData.name = data.name
    if (data.email) updateData.email = data.email

    await this.db.update(user).set(updateData).where(eq(user.id, id))
    return this.findById(id)
  }
}
