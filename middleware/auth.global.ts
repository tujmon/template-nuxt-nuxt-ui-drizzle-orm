import { authClient } from '~~/utils/auth-client'

export default defineNuxtRouteMiddleware(async (to) => {
  // Use Nuxt's useFetch integration to fetch session with correct cookies on SSR
  const { data: session } = await authClient.useSession(useFetch)

  const isAuthPage = ['/login', '/register'].includes(to.path)
  const isPublicPage = to.path === '/' || isAuthPage

  // Redirect to login if user is not authenticated and attempts to access protected routes
  if (!session.value && !isPublicPage) {
    return navigateTo('/login')
  }

  // Redirect authenticated users trying to access login/register to dashboard
  if (session.value && isAuthPage) {
    return navigateTo('/dashboard')
  }
})
