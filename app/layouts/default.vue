<script setup lang="ts">
import { authClient } from '~/utils/auth-client'

const { data: session } = await useAuthSession()
const router = useRouter()

const impersonatedBy = computed(() => {
  const sessionData = session.value?.session as { impersonatedBy?: string } | undefined
  return sessionData?.impersonatedBy
})

const stopImpersonating = async () => {
  const { error } = await authClient.admin.stopImpersonating()
  if (!error) {
    window.location.assign('/admin')
  }
}

const handleLogout = async () => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        router.push('/login')
      }
    }
  })
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-default text-default">
    <div
      v-if="impersonatedBy"
      class="border-b border-muted bg-muted px-4 py-2 text-sm text-default"
    >
      <div class="max-w-7xl mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Você está impersonando <strong>{{ session?.user.name }}</strong>.
        </span>
        <UButton
          color="warning"
          variant="soft"
          size="xs"
          icon="i-lucide-undo-2"
          @click="stopImpersonating"
        >
          Voltar ao admin
        </UButton>
      </div>
    </div>

    <!-- Navigation Bar -->
    <header class="border-b border-muted bg-elevated/50 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-8">
          <NuxtLink to="/" class="text-xl font-bold text-primary">
            NuxtTemplate
          </NuxtLink>
          <nav class="hidden md:flex space-x-6">
            <NuxtLink to="/" class="text-sm font-medium text-toned hover:text-highlighted transition-colors" active-class="text-primary">
              Início
            </NuxtLink>
            <NuxtLink to="/dashboard" class="text-sm font-medium text-toned hover:text-highlighted transition-colors" active-class="text-primary">
              Dashboard
            </NuxtLink>
            <NuxtLink v-if="(session?.user as any)?.role === 'admin'" to="/admin" class="text-sm font-medium text-toned hover:text-highlighted transition-colors" active-class="text-primary">
              Painel Admin
            </NuxtLink>
          </nav>
        </div>

        <div class="flex items-center space-x-4">
          <template v-if="session">
            <span class="text-sm text-muted hidden sm:inline">
              Olá, <span class="text-highlighted font-semibold">{{ session.user.name }}</span>
            </span>
            <UButton color="error" variant="ghost" size="sm" @click="handleLogout">
              Sair
            </UButton>
          </template>
          <template v-else>
            <UButton to="/login" variant="ghost" color="neutral" size="sm">
              Entrar
            </UButton>
            <UButton to="/register" color="primary" size="sm">
              Criar Conta
            </UButton>
          </template>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-muted bg-default py-6 text-center text-xs text-muted">
      &copy; {{ new Date().getFullYear() }} Nuxt Drizzle Better-Auth template. Todos os direitos reservados.
    </footer>
  </div>
</template>
