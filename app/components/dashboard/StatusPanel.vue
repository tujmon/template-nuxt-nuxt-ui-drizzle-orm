<script setup lang="ts">
defineProps<{
  status: string
  count: number
}>()
</script>

<template>
  <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
    <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider">Painel de Status (Props)</h3>
    <div class="flex items-center justify-between">
      <div>
        <span class="text-xs text-slate-500 block">Status Atual</span>
        <span class="text-lg font-bold text-emerald-400">{{ status }}</span>
      </div>
      <div class="text-right">
        <span class="text-xs text-slate-500 block">Cliques Registrados</span>
        <span class="text-3xl font-extrabold text-white">{{ count }}</span>
      </div>
    </div>
  </div>
</template>
