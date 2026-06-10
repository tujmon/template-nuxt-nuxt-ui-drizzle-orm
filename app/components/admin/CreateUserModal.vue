<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { authClient } from '~/utils/auth-client'
import { type CreateUserInput, createUserSchema } from '~~/shared/validation/auth'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'created'): void
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const toast = useToast()
const creatingUser = ref(false)

const newUser = reactive<CreateUserInput>({
  name: '',
  email: '',
  password: '',
  role: 'user'
})

const handleCreateUser = async (event: FormSubmitEvent<CreateUserInput>) => {
  creatingUser.value = true
  try {
    const { error } = await authClient.admin.createUser({
      email: event.data.email,
      password: event.data.password,
      name: event.data.name,
      role: event.data.role
    })

    if (error) {
      toast.add({ title: 'Erro ao criar usuário', description: error.message, color: 'error' })
    } else {
      toast.add({ title: 'Usuário criado com sucesso', color: 'success' })
      isOpen.value = false
      Object.assign(newUser, { name: '', email: '', password: '', role: 'user' })
      emit('created')
    }
  } catch (err: unknown) {
    const description = err instanceof Error ? err.message : 'Erro inesperado'
    toast.add({ title: 'Erro ao criar usuário', description, color: 'error' })
  } finally {
    creatingUser.value = false
  }
}
</script>

<template>
  <UModal v-model:open="isOpen">
    <template #content>
      <UCard class="bg-elevated border-muted">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-highlighted">Criar Novo Usuário</h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              class="-my-1"
              @click="isOpen = false"
            />
          </div>
        </template>

        <UForm :schema="createUserSchema" :state="newUser" class="space-y-4" @submit="handleCreateUser">
          <UFormField label="Nome" name="name">
            <UInput v-model="newUser.name" placeholder="Ex: Arthur Silva" color="neutral" class="w-full" />
          </UFormField>
          <UFormField label="E-mail" name="email">
            <UInput v-model="newUser.email" type="email" placeholder="Ex: arthur@exemplo.com" color="neutral" class="w-full" />
          </UFormField>
          <UFormField label="Senha" name="password">
            <UInput v-model="newUser.password" type="password" placeholder="Senha forte" color="neutral" class="w-full" />
          </UFormField>
          <UFormField label="Cargo" name="role">
            <USelect
              v-model="newUser.role"
              :items="[
                { label: 'Usuário Comum', value: 'user' },
                { label: 'Administrador', value: 'admin' }
              ]"
              color="neutral"
              class="w-full"
            />
          </UFormField>

          <div class="flex justify-end gap-3 pt-4">
            <UButton color="neutral" variant="ghost" @click="isOpen = false">Cancelar</UButton>
            <UButton type="submit" color="primary" :loading="creatingUser">Criar</UButton>
          </div>
        </UForm>
      </UCard>
    </template>
  </UModal>
</template>
