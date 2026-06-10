<script setup lang="ts">
import { usePerformanceMeasure } from '~/composables/performance-measure'
import { authClient } from '~/utils/auth-client'
import { type LoginInput, loginSchema } from '~~/shared/validation/auth'

definePageMeta({
  layout: 'auth',
  auth: 'guest'
})

useSeoMeta({
  title: 'Entrar — Nuxt 3 Full-Stack Template'
})

const router = useRouter()
const performanceMeasure = usePerformanceMeasure()

const state = reactive<LoginInput>({
  email: '',
  password: ''
})

const isLoading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

const fillDemoCredentials = () => {
  state.email = 'demo@example.com'
  state.password = 'password123'
  errorMessage.value = ''
}

const fillAdminCredentials = () => {
  state.email = 'admin@example.com'
  state.password = 'admin123'
  errorMessage.value = ''
}

const onSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ''

  await performanceMeasure.trackAsync('user-login-attempt', async () => {
    try {
      const { error } = await authClient.signIn.email({
        email: state.email,
        password: state.password
      })

      if (error) {
        errorMessage.value = error.message || 'Credenciais inválidas'
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      const error = err as Error
      errorMessage.value = error.message || 'Erro inesperado ao realizar login'
    } finally {
      isLoading.value = false
    }
  })
}
</script>

<template>
  <div class="rounded-xl border border-muted bg-elevated p-6 shadow-lg sm:p-8">
    <div class="mb-8 space-y-2">
      <div class="flex items-center gap-3">
        <div class="flex size-11 items-center justify-center rounded-lg bg-primary text-lg font-black text-inverted">
          N
        </div>
        <div>
          <p class="text-xs font-medium uppercase tracking-wider text-primary">Acesso</p>
          <h2 class="text-2xl font-bold tracking-tight text-highlighted">Bem-vindo de volta</h2>
        </div>
      </div>
      <p class="text-sm text-muted">Use sua conta para continuar.</p>
    </div>

    <UAlert
      v-if="errorMessage"
      class="mb-5"
      color="error"
      variant="soft"
      icon="i-lucide-triangle-alert"
      :title="errorMessage"
    />

    <UForm :schema="loginSchema" :state="state" class="space-y-5" @submit="onSubmit">
      <UFormField label="E-mail" name="email">
        <UInput
          v-model="state.email"
          autocomplete="email"
          placeholder="seuemail@exemplo.com"
          icon="i-lucide-mail"
          size="lg"
          color="neutral"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Senha" name="password">
        <UInput
          v-model="state.password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          placeholder="••••••••"
          icon="i-lucide-lock"
          size="lg"
          color="neutral"
          class="w-full"
        >
          <template #trailing>
            <UButton
              type="button"
              color="neutral"
              variant="ghost"
              square
              size="xs"
              :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <UButton type="submit" block size="lg" color="primary" :loading="isLoading" class="mt-2">
        Entrar
      </UButton>
    </UForm>

    <div class="mt-5 grid grid-cols-2 gap-2">
      <UButton type="button" color="neutral" variant="subtle" size="sm" @click="fillDemoCredentials">
        Demo
      </UButton>
      <UButton type="button" color="neutral" variant="subtle" size="sm" @click="fillAdminCredentials">
        Admin
      </UButton>
    </div>

    <div class="mt-6 border-t border-muted pt-5 text-center text-sm text-muted">
      Ainda não tem conta?
      <NuxtLink to="/register" class="text-primary hover:text-primary font-semibold transition-colors">
        Cadastre-se
      </NuxtLink>
    </div>
  </div>
</template>
