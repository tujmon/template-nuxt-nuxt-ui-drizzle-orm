<script setup lang="ts">
import { authClient } from '~~/utils/auth-client'
import { usePerformanceMeasure } from '~~/composables/performance-measure'
import StatusPanel from '~~/components/dashboard/StatusPanel.vue'
import ActionPanel from '~~/components/dashboard/ActionPanel.vue'

definePageMeta({
  auth: 'protected'
})

const { data: session } = await authClient.useSession(useFetch)
const performanceMeasure = usePerformanceMeasure()

// Local states for Component Communication Demo
const currentStatus = ref('Ativo')
const clickCount = ref(0)

const simulateHeavyTask = async () => {
  await performanceMeasure.trackAsync('simulate-dashboard-heavy-task', async () => {
    // Simulate some API request delay / calculations
    await new Promise(resolve => setTimeout(resolve, 450))
    clickCount.value += 10
  }, 300) // Threshold of 300ms will trigger a warning alert in console since task takes ~450ms
}

const handleIncrement = () => {
  performanceMeasure.startMark('increment-action')
  clickCount.value++
  performanceMeasure.endMark('increment-action')
}

const handleStatusUpdate = (newStatus: string) => {
  performanceMeasure.startMark('status-change-action')
  currentStatus.value = newStatus
  performanceMeasure.endMark('status-change-action')
}
</script>

<template>
  <div v-if="session" class="space-y-8">
    <!-- Session Banner -->
    <div class="p-6 rounded-2xl bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-800/40">
      <div class="flex items-center space-x-4">
        <UAvatar :alt="session.user.name" size="lg" />
        <div>
          <h2 class="text-xl font-bold text-white">Bem-vindo, {{ session.user.name }}!</h2>
          <p class="text-xs text-slate-400 font-mono mt-0.5">Sessão ID: {{ session.session.id }}</p>
        </div>
      </div>
    </div>

    <!-- Metadata Details -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Seu E-mail</span>
        <span class="text-sm font-semibold text-slate-200 mt-1 block">{{ session.user.email }}</span>
      </div>

      <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Expira em</span>
        <span class="text-sm font-semibold text-slate-200 mt-1 block">
          {{ new Date(session.session.expiresAt).toLocaleDateString() }} às {{ new Date(session.session.expiresAt).toLocaleTimeString() }}
        </span>
      </div>

      <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Teste de Performance</span>
          <span class="text-xs text-slate-400 mt-1 block">Simular ação lenta (> 300ms)</span>
        </div>
        <UButton color="orange" size="sm" icon="i-heroicons-bolt" @click="simulateHeavyTask">
          Testar
        </UButton>
      </div>
    </div>

    <!-- Component Communication & TypeSafety Demo Section -->
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-bold text-white">Comunicação e Fluxo de Dados</h3>
        <p class="text-xs text-slate-400">Exemplo de comunicação unificada usando Props e Emits entre componentes filhos.</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatusPanel :status="currentStatus" :count="clickCount" />
        <ActionPanel @increment="handleIncrement" @update-status="handleStatusUpdate" />
      </div>
    </div>
  </div>
</template>
