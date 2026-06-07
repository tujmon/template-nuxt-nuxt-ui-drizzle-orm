<script setup lang="ts">
import { registerSchema, type RegisterInput } from '~~/shared/validation/auth'
import { authClient } from '~~/utils/auth-client'
import { usePerformanceMeasure } from '~~/composables/performance-measure'

definePageMeta({
  layout: 'auth',
  auth: 'guest'
})

useSeoMeta({
  title: 'Criar Conta — Nuxt 3 Full-Stack Template'
})

const router = useRouter()
const performanceMeasure = usePerformanceMeasure()

const state = reactive<RegisterInput>({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const errorMessage = ref('')

const onSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ''

  await performanceMeasure.trackAsync('user-registration-attempt', async () => {
    try {
      const { error } = await authClient.signUp.email({
        name: state.name,
        email: state.email,
        password: state.password
      })

      if (error) {
        errorMessage.value = error.message || 'Erro ao criar conta'
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      const error = err as Error
      errorMessage.value = error.message || 'Erro inesperado ao criar conta'
    } finally {
      isLoading.value = false
    }
  })
}
</script>

<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-white tracking-tight">Criar Conta</h2>
      <p class="text-sm text-slate-400 mt-2">Cadastre-se para começar a usar a plataforma</p>
    </div>

    <!-- Error Alert -->
    <UAlert
      v-if="errorMessage"
      color="red"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
      :title="errorMessage"
    />

    <UForm :schema="registerSchema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Nome" name="name">
        <UInput v-model="state.name" placeholder="Seu Nome Completo" icon="i-heroicons-user" size="lg" />
      </UFormGroup>

      <UFormGroup label="E-mail" name="email">
        <UInput v-model="state.email" placeholder="seuemail@exemplo.com" icon="i-heroicons-envelope" size="lg" />
      </UFormGroup>

      <UFormGroup label="Senha" name="password">
        <UInput v-model="state.password" type="password" placeholder="••••••••" icon="i-heroicons-lock-closed" size="lg" />
      </UFormGroup>

      <UFormGroup label="Confirmar Senha" name="confirmPassword">
        <UInput v-model="state.confirmPassword" type="password" placeholder="••••••••" icon="i-heroicons-lock-closed" size="lg" />
      </UFormGroup>

      <UButton type="submit" block size="lg" :loading="isLoading" class="mt-6">
        Registrar
      </UButton>
    </UForm>

    <div class="text-center text-sm text-slate-400 mt-4">
      Já possui uma conta?
      <NuxtLink to="/login" class="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
        Entrar
      </NuxtLink>
    </div>
  </div>
</template>
