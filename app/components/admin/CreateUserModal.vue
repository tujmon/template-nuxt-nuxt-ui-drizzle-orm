<script setup lang="ts">
import { authClient } from '~/utils/auth-client'

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

const newUser = reactive<{
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
}>({
  name: '',
  email: '',
  password: '',
  role: 'user'
})

const handleCreateUser = async () => {
  if (!newUser.name || !newUser.email || !newUser.password) {
    toast.add({ title: 'Campos obrigatórios', description: 'Preencha todos os campos.', color: 'warning' })
    return
  }
  creatingUser.value = true
  try {
    const { error } = await authClient.admin.createUser({
      email: newUser.email,
      password: newUser.password,
      name: newUser.name,
      role: newUser.role
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
      <UCard class="bg-slate-900 border-slate-800">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-white">Criar Novo Usuário</h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark"
              class="-my-1"
              @click="isOpen = false"
            />
          </div>
        </template>

        <form class="space-y-4" @submit.prevent="handleCreateUser">
          <UFormField label="Nome" required>
            <UInput v-model="newUser.name" placeholder="Ex: Arthur Silva" color="neutral" class="w-full" />
          </UFormField>
          <UFormField label="E-mail" required>
            <UInput v-model="newUser.email" type="email" placeholder="Ex: arthur@exemplo.com" color="neutral" class="w-full" />
          </UFormField>
          <UFormField label="Senha" required>
            <UInput v-model="newUser.password" type="password" placeholder="Senha forte" color="neutral" class="w-full" />
          </UFormField>
          <UFormField label="Cargo">
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
            <UButton type="submit" color="success" :loading="creatingUser">Criar</UButton>
          </div>
        </form>
      </UCard>
    </template>
  </UModal>
</template>
