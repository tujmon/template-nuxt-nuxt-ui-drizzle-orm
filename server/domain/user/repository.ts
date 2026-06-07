import type { UserDomain } from './entity'

export interface UserRepository {
  /**
   * Find a user by their unique ID.
   */
  findById(id: string): Promise<UserDomain | null>

  /**
   * Update user details in the persistence layer.
   */
  update(id: string, data: Partial<Pick<UserDomain, 'name' | 'email'>>): Promise<UserDomain>
}
