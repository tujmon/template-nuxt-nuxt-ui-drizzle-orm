<script setup lang="ts">
import { loginSchema, type LoginInput } from '~~/shared/validation/auth'
import { authClient } from '~~/utils/auth-client'
import { useTracker } from '~~/composables/tracker'

definePageMeta({
  layout: 'auth'
})

const router = useRouter()
const tracker = useTracker()

const state = reactive<LoginInput>({
  email: '',
  password: ''
})

const isLoading = ref(false)
const errorMessage = ref('')

const onSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ''

  await tracker.trackAsync('user-login-attempt', async () => {
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
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-white tracking-tight">Bem-vindo de volta</h2>
      <p class="text-sm text-slate-400 mt-2">Acesse sua conta para continuar</p>
    </div>

    <!-- Error Alert -->
    <UAlert
      v-if="errorMessage"
      color="red"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
      :title="errorMessage"
    />

    <UForm :schema="loginSchema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="E-mail" name="email">
        <UInput v-model="state.email" placeholder="seuemail@exemplo.com" icon="i-heroicons-envelope" size="lg" />
      </UFormGroup>

      <UFormGroup label="Senha" name="password">
        <UInput v-model="state.password" type="password" placeholder="••••••••" icon="i-heroicons-lock-closed" size="lg" />
      </UFormGroup>

      <UButton type="submit" block size="lg" :loading="isLoading" class="mt-6">
        Entrar
      </UButton>
    </UForm>

    <div class="text-center text-sm text-slate-400 mt-4">
      Não tem uma conta?
      <NuxtLink to="/register" class="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
        Cadastre-se
      </NuxtLink>
    </div>
  </div>
</template>
