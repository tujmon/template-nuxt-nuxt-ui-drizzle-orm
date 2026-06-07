export default defineNuxtRouteMiddleware(async () => {
  const { data: session } = await useAuthSession()

  if (!session.value) {
    return navigateTo('/login')
  }

  const user = session.value.user as { role?: string }
  if (user.role !== 'admin') {
    return navigateTo('/dashboard')
  }
})
