import type { UserRepository } from '../../domain/user/repository'
import type { UserDomain } from '../../domain/user/entity'
import { db } from '../../database/client'
import { user } from '../../database/schema/auth'
import { eq } from 'drizzle-orm'

class DrizzleUserRepository implements UserRepository {
  private db = db

  private toDomain(row: typeof user.$inferSelect): UserDomain {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      emailVerified: row.emailVerified,
      image: row.image,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }
  }

  async findById(id: string): Promise<UserDomain | null> {
    const results = await this.db.select().from(user).where(eq(user.id, id)).limit(1)
    return results[0] ? this.toDomain(results[0]) : null
  }

  async update(id: string, data: Partial<Pick<UserDomain, 'name' | 'email'>>): Promise<UserDomain> {
    const updateData: Partial<typeof user.$inferInsert> = {
      updatedAt: new Date()
    }
    if (data.name !== undefined) updateData.name = data.name
    if (data.email !== undefined) updateData.email = data.email

    await this.db.update(user).set(updateData).where(eq(user.id, id))
    const updated = await this.findById(id)
    if (!updated) {
      throw new Error(`User not found for update: ${id}`)
    }
    return updated
  }
}

export const drizzleUserRepository = new DrizzleUserRepository()
