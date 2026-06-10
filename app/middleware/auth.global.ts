export default defineNuxtRouteMiddleware(async (to) => {
  const authMode = to.meta.auth ?? 'protected'

  if (authMode === 'public') {
    return
  }

  const { data: session } = await useAuthSession()

  if (!session.value && authMode === 'protected') {
    return navigateTo('/login')
  }

  if (session.value && authMode === 'guest') {
    return navigateTo('/dashboard')
  }
})
