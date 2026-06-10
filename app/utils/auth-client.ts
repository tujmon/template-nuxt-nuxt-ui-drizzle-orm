import { adminClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'

export const authClient = createAuthClient({
  plugins: [adminClient()]
})

export const { signIn, signUp, signOut, useSession } = authClient
