<script setup lang="ts">
import { authClient } from '~/utils/auth-client'

interface AdminUser {
  id: string
  name: string
  email: string
  role?: string
  banned?: boolean
  banReason?: string
  image?: string | null
}

const props = defineProps<{
  modelValue: boolean
  user: AdminUser | null
}>()

const emit = defineEmits(['update:modelValue', 'banned'])

const isOpen = computed({
  get() {
    return props.modelValue
  },
  set(val: boolean) {
    emit('update:modelValue', val)
  }
})

const toast = useToast()
const banReason = ref('')

const confirmBan = async () => {
  if (!props.user) return
  try {
    const { error } = await authClient.admin.banUser({
      userId: props.user.id,
      banReason: banReason.value || undefined
    })

    if (error) {
      toast.add({ title: 'Erro ao banir usuário', description: error.message, color: 'error' })
    } else {
      toast.add({
        title: 'Usuário banido',
        description: `O usuário ${props.user.name} foi banido com sucesso.`,
        color: 'success'
      })
      isOpen.value = false
      emit('banned')
    }
  } catch (err: unknown) {
    const description = err instanceof Error ? err.message : 'Erro inesperado'
    toast.add({ title: 'Erro ao banir', description, color: 'error' })
  }
}
</script>

<template>
  <UModal v-model:open="isOpen">
    <template #content>
      <UCard class="bg-elevated border-muted">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-highlighted">Banir Usuário</h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              class="-my-1"
              @click="isOpen = false"
            />
          </div>
        </template>

        <div class="space-y-4">
          <p class="text-sm text-toned">
            Tem certeza de que deseja banir <span class="font-bold text-highlighted">{{ user?.name }}</span>? Este usuário perderá acesso imediato ao aplicativo.
          </p>
          <UFormField label="Motivo (opcional)">
            <UInput v-model="banReason" placeholder="Ex: Violação dos termos de uso" color="neutral" class="w-full" />
          </UFormField>

          <div class="flex justify-end gap-3 pt-4">
            <UButton color="neutral" variant="ghost" @click="isOpen = false">Cancelar</UButton>
            <UButton color="error" @click="confirmBan">Confirmar Banimento</UButton>
          </div>
        </div>
      </UCard>
    </template>
  </UModal>
</template>
