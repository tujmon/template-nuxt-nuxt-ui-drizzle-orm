export interface UserDomain {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Helper function to validate if an email matches standard email pattern
 * in the domain context.
 */
export function validateUserEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
