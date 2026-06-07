<script setup lang="ts">
const emit = defineEmits<{
  (e: 'increment'): void
  (e: 'update-status', status: string): void
}>()

const statusOptions = ['Ativo', 'Ausente', 'Em Reunião', 'Focado']
</script>

<template>
  <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
    <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider">Painel de Ações (Emits)</h3>
    <div class="flex flex-col gap-3">
      <UButton block color="primary" icon="i-heroicons-plus" @click="emit('increment')">
        Incrementar Cliques
      </UButton>

      <div class="border-t border-slate-800 pt-3">
        <span class="text-xs text-slate-500 block mb-2">Alterar Status</span>
        <div class="grid grid-cols-2 gap-2">
          <UButton
            v-for="opt in statusOptions"
            :key="opt"
            variant="soft"
            color="neutral"
            size="xs"
            @click="emit('update-status', opt)"
          >
            {{ opt }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
