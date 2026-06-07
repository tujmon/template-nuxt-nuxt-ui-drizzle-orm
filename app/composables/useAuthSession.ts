import { authClient } from '~/utils/auth-client'

/**
 * Wraps Better Auth's `useSession` with Nuxt's `useFetch` for SSR-safe
 * session retrieval. Since `useFetch` deduplicates requests by key,
 * multiple calls within the same render cycle share a single fetch.
 */
export const useAuthSession = () => {
  return authClient.useSession(useFetch)
}
