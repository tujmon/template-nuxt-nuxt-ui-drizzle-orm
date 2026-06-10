<script setup lang="ts">
defineProps<{
  status: string
  count: number
}>()
</script>

<template>
  <div class="p-6 rounded-2xl bg-elevated border border-muted space-y-4">
    <h3 class="text-sm font-semibold text-muted uppercase tracking-wider">Painel de Status (Props)</h3>
    <div class="flex items-center justify-between">
      <div>
        <span class="text-xs text-dimmed block">Status Atual</span>
        <span class="text-lg font-bold text-primary">{{ status }}</span>
      </div>
      <div class="text-right">
        <span class="text-xs text-dimmed block">Cliques Registrados</span>
        <span class="text-3xl font-extrabold text-highlighted">{{ count }}</span>
      </div>
    </div>
  </div>
</template>
