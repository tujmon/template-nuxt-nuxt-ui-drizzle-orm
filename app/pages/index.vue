<script setup lang="ts">
definePageMeta({
  auth: 'public'
})

useSeoMeta({
  title: 'Início — Nuxt 4 Full-Stack Template',
  description:
    'Template opinativo com Nuxt UI, Drizzle ORM, Better-Auth e Zod. Projetado para segurança, velocidade e tipagem estrita de ponta a ponta.'
})
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-12">
    <!-- Hero Section -->
    <div class="text-center py-12 space-y-4">
      <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
        Nuxt 4 Boilerplate
      </h1>
      <p class="text-lg text-muted max-w-2xl mx-auto">
        Template opinativo com Nuxt UI, Drizzle ORM, Better-Auth e Zod. Projetado para segurança, velocidade e tipagem estrita de ponta a ponta.
      </p>
      <div class="flex justify-center space-x-4 pt-4">
        <UButton to="/dashboard" size="lg" icon="i-lucide-layout-dashboard">
          Ir para o Dashboard
        </UButton>
        <UButton to="/register" color="neutral" variant="ghost" size="lg">
          Criar uma Conta
        </UButton>
      </div>
    </div>

    <!-- Tech Stack Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="p-6 rounded-2xl bg-elevated border border-muted space-y-3">
        <div class="flex items-center space-x-2 text-primary">
          <UIcon name="i-lucide-server" class="w-6 h-6" />
          <h3 class="font-bold text-lg text-highlighted">Drizzle ORM & Database</h3>
        </div>
        <p class="text-sm text-muted">
          Gerenciamento de banco de dados robusto e tipado. Consultas rápidas, migrações automáticas e suporte a transações organizados em camadas de serviços dedicados.
        </p>
      </div>

      <div class="p-6 rounded-2xl bg-elevated border border-muted space-y-3">
        <div class="flex items-center space-x-2 text-secondary">
          <UIcon name="i-lucide-shield-check" class="w-6 h-6" />
          <h3 class="font-bold text-lg text-highlighted">Better-Auth</h3>
        </div>
        <p class="text-sm text-muted">
          Autenticação moderna com suporte a e-mail/senha, OAuth, sessões seguras persistidas no banco e Hooks integrados ao ciclo de vida do Nuxt.
        </p>
      </div>

      <div class="p-6 rounded-2xl bg-elevated border border-muted space-y-3">
        <div class="flex items-center space-x-2 text-info">
          <UIcon name="i-lucide-code" class="w-6 h-6" />
          <h3 class="font-bold text-lg text-highlighted">Zod Validation</h3>
        </div>
        <p class="text-sm text-muted">
          Esquemas de validação compartilhados entre cliente (validação de formulários reativos no front-end) e servidor (segurança de payload nas rotas de API).
        </p>
      </div>

      <div class="p-6 rounded-2xl bg-elevated border border-muted space-y-3">
        <div class="flex items-center space-x-2 text-secondary">
          <UIcon name="i-lucide-chart-line" class="w-6 h-6" />
          <h3 class="font-bold text-lg text-highlighted">Performance Auditing</h3>
        </div>
        <p class="text-sm text-muted">
          Métricas integradas usando o composable <code class="text-secondary font-mono">usePerformanceMeasure</code> no front-end baseado na API de User Timing oficial para monitoramento de latência.
        </p>
      </div>
    </div>

    <!-- Conventions and Rules -->
    <div class="p-8 rounded-2xl bg-elevated border border-muted space-y-6">
      <h2 class="text-2xl font-bold text-highlighted border-b border-muted pb-4">Conveções de Componentes & Comunicação</h2>
      
      <div class="space-y-4">
        <div>
          <h4 class="font-semibold text-highlighted">1. Quando criar um Componente?</h4>
          <ul class="list-disc pl-5 text-sm text-muted mt-1 space-y-1">
            <li><strong>Reuso:</strong> Quando o trecho visual for usado em mais de uma página (ex: botões personalizados, formulários genéricos).</li>
            <li><strong>Complexidade:</strong> Quando o arquivo da página exceder ~200 linhas de código.</li>
            <li><strong>Encapsulamento de Estado:</strong> Se um componente gerencia estados internos complexos (ex: modais, popovers de busca).</li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-highlighted">2. Comunicação entre Componentes</h4>
          <ul class="list-disc pl-5 text-sm text-muted mt-1 space-y-1">
            <li>Use <strong>Props</strong> e <strong>Emits</strong> fortemente tipados (macros <code class="text-primary">defineProps</code> e <code class="text-primary">defineEmits</code>) para parent-child simples.</li>
            <li>Use o composable do Nuxt <code class="text-primary">useState</code> para estados globais leves e compartilhados no ciclo de requisição.</li>
            <li>Para controle de fluxo de dados bidirecional complexo ou persistência global, implemente <strong>Pinia</strong>. Nunca utilize Event Bus customizados.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
