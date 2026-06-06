import { hashPassword } from 'better-auth/crypto'
import type { SeedClient, SeedUser } from './types'

type CredentialUser = {
  id: string
  email: string
  password: string
}

type UserRow = {
  id: string
  email: string
}

export const upsertCredentialUser = async (
  client: SeedClient,
  seedUser: SeedUser
): Promise<CredentialUser> => {
  const now = new Date()
  const passwordHash = await hashPassword(seedUser.password)

  const userResult = await client.query(
    `
      INSERT INTO "user" (
        id,
        name,
        email,
        email_verified,
        image,
        created_at,
        updated_at
      )
      VALUES (
        $1,
        $2,
        $3,
        true,
        null,
        $4,
        $4
      )
      ON CONFLICT (id) DO UPDATE
      SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        email_verified = true,
        updated_at = EXCLUDED.updated_at
      RETURNING id, email;
    `,
    [seedUser.id, seedUser.name, seedUser.email, now]
  )

  const user = userResult.rows[0] as UserRow | undefined

  if (!user) {
    throw new Error('Credential user seed did not return a user.')
  }

  await client.query(
    `
      INSERT INTO account (
        id,
        account_id,
        provider_id,
        user_id,
        password,
        created_at,
        updated_at
      )
      VALUES (
        $1,
        $2,
        'credential',
        $2,
        $3,
        $4,
        $4
      )
      ON CONFLICT (id) DO UPDATE
      SET
        account_id = EXCLUDED.account_id,
        provider_id = EXCLUDED.provider_id,
        user_id = EXCLUDED.user_id,
        password = EXCLUDED.password,
        updated_at = EXCLUDED.updated_at;
    `,
    [seedUser.accountId, user.id, passwordHash, now]
  )

  return {
    id: user.id,
    email: user.email,
    password: seedUser.password
  }
}

export const deleteCredentialUser = async (client: SeedClient, seedUser: SeedUser): Promise<void> => {
  await client.query('DELETE FROM account WHERE id = $1;', [seedUser.accountId])
  await client.query('DELETE FROM session WHERE user_id = $1;', [seedUser.id])
  await client.query('DELETE FROM "user" WHERE id = $1;', [seedUser.id])
}
