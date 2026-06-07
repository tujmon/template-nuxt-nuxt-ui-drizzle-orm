<script setup lang="ts">
import { authClient } from '~~/utils/auth-client'

const { data: session } = await useAuthSession()
const router = useRouter()

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
  <div class="min-h-screen flex flex-col bg-slate-950 text-slate-100">
    <!-- Navigation Bar -->
    <header class="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-8">
          <NuxtLink to="/" class="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            NuxtTemplate
          </NuxtLink>
          <nav class="hidden md:flex space-x-6">
            <NuxtLink to="/" class="text-sm font-medium text-slate-300 hover:text-white transition-colors" active-class="text-emerald-400">
              Início
            </NuxtLink>
            <NuxtLink to="/dashboard" class="text-sm font-medium text-slate-300 hover:text-white transition-colors" active-class="text-emerald-400">
              Dashboard
            </NuxtLink>
          </nav>
        </div>

        <div class="flex items-center space-x-4">
          <template v-if="session">
            <span class="text-sm text-slate-400 hidden sm:inline">
              Olá, <span class="text-slate-200 font-semibold">{{ session.user.name }}</span>
            </span>
            <UButton color="red" variant="ghost" size="sm" @click="handleLogout">
              Sair
            </UButton>
          </template>
          <template v-else>
            <UButton to="/login" variant="ghost" color="gray" size="sm">
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
    <footer class="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
      &copy; {{ new Date().getFullYear() }} Nuxt Drizzle Better-Auth template. Todos os direitos reservados.
    </footer>
  </div>
</template>
