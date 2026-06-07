<script setup lang="ts">
definePageMeta({
  auth: 'public'
})

useSeoMeta({
  title: 'Início — Nuxt 3 Full-Stack Template',
  description: 'Template opinativo com Nuxt UI, Drizzle ORM, Better-Auth e Zod. Projetado para segurança, velocidade e tipagem estrita de ponta a ponta.'
})
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-12">
    <!-- Hero Section -->
    <div class="text-center py-12 space-y-4">
      <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500 bg-clip-text text-transparent">
        Nuxt 3 Boilerplate
      </h1>
      <p class="text-lg text-slate-400 max-w-2xl mx-auto">
        Template opinativo com Nuxt UI, Drizzle ORM, Better-Auth e Zod. Projetado para segurança, velocidade e tipagem estrita de ponta a ponta.
      </p>
      <div class="flex justify-center space-x-4 pt-4">
        <UButton to="/dashboard" size="lg" icon="i-heroicons-squares-2x2">
          Ir para o Dashboard
        </UButton>
        <UButton to="/register" color="neutral" variant="ghost" size="lg">
          Criar uma Conta
        </UButton>
      </div>
    </div>

    <!-- Tech Stack Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
        <div class="flex items-center space-x-2 text-emerald-400">
          <UIcon name="i-heroicons-server" class="w-6 h-6" />
          <h3 class="font-bold text-lg text-white">Drizzle ORM & Database</h3>
        </div>
        <p class="text-sm text-slate-400">
          Gerenciamento de banco de dados robusto e tipado. Consultas rápidas, migrações automáticas e suporte a transações organizados em camadas de serviços dedicados.
        </p>
      </div>

      <div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
        <div class="flex items-center space-x-2 text-indigo-400">
          <UIcon name="i-heroicons-shield-check" class="w-6 h-6" />
          <h3 class="font-bold text-lg text-white">Better-Auth</h3>
        </div>
        <p class="text-sm text-slate-400">
          Autenticação moderna com suporte a e-mail/senha, OAuth, sessões seguras persistidas no banco e Hooks integrados ao ciclo de vida do Nuxt.
        </p>
      </div>

      <div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
        <div class="flex items-center space-x-2 text-sky-400">
          <UIcon name="i-heroicons-code-bracket" class="w-6 h-6" />
          <h3 class="font-bold text-lg text-white">Zod Validation</h3>
        </div>
        <p class="text-sm text-slate-400">
          Esquemas de validação compartilhados entre cliente (validação de formulários reativos no front-end) e servidor (segurança de payload nas rotas de API).
        </p>
      </div>

      <div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
        <div class="flex items-center space-x-2 text-pink-400">
          <UIcon name="i-heroicons-presentation-chart-line" class="w-6 h-6" />
          <h3 class="font-bold text-lg text-white">Performance Auditing</h3>
        </div>
        <p class="text-sm text-slate-400">
          Métricas integradas usando o composable <code class="text-pink-300 font-mono">usePerformanceMeasure</code> no front-end baseado na API de User Timing oficial para monitoramento de latência.
        </p>
      </div>
    </div>

    <!-- Conventions and Rules -->
    <div class="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-6">
      <h2 class="text-2xl font-bold text-white border-b border-slate-800 pb-4">Conveções de Componentes & Comunicação</h2>
      
      <div class="space-y-4">
        <div>
          <h4 class="font-semibold text-slate-200">1. Quando criar um Componente?</h4>
          <ul class="list-disc pl-5 text-sm text-slate-400 mt-1 space-y-1">
            <li><strong>Reuso:</strong> Quando o trecho visual for usado em mais de uma página (ex: botões personalizados, formulários genéricos).</li>
            <li><strong>Complexidade:</strong> Quando o arquivo da página exceder ~200 linhas de código.</li>
            <li><strong>Encapsulamento de Estado:</strong> Se um componente gerencia estados internos complexos (ex: modais, popovers de busca).</li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-slate-200">2. Comunicação entre Componentes</h4>
          <ul class="list-disc pl-5 text-sm text-slate-400 mt-1 space-y-1">
            <li>Use <strong>Props</strong> e <strong>Emits</strong> fortemente tipados (macros <code class="text-emerald-300">defineProps</code> e <code class="text-emerald-300">defineEmits</code>) para parent-child simples.</li>
            <li>Use o composable do Nuxt <code class="text-emerald-300">useState</code> para estados globais leves e compartilhados no ciclo de requisição.</li>
            <li>Para controle de fluxo de dados bidirecional complexo ou persistência global, implemente <strong>Pinia</strong>. Nunca utilize Event Bus customizados.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
