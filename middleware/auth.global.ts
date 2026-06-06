import { authClient } from '~~/utils/auth-client'

export default defineNuxtRouteMiddleware(async (to) => {
  // Use Nuxt's useFetch integration to fetch session with correct cookies on SSR
  const { data: session } = await authClient.useSession(useFetch)

  const authMode = to.meta.auth ?? 'protected'

  // Redirect to login if user is not authenticated and attempts to access protected routes
  if (!session.value && authMode === 'protected') {
    return navigateTo('/login')
  }

  // Redirect authenticated users trying to access login/register to dashboard
  if (session.value && authMode === 'guest') {
    return navigateTo('/dashboard')
  }
})
