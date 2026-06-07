<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <div class="min-h-screen grid lg:grid-cols-[minmax(0,1fr)_480px]">
      <section class="hidden lg:flex flex-col justify-between border-r border-slate-800 bg-slate-900 px-10 py-8">
        <NuxtLink to="/" class="inline-flex items-center gap-3 text-sm font-semibold text-slate-200">
          <span class="flex size-9 items-center justify-center rounded-lg bg-emerald-400 text-slate-950 font-black">N</span>
          NuxtTemplate
        </NuxtLink>

        <div class="max-w-xl space-y-6">
          <div class="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
            <UIcon name="i-heroicons-shield-check" class="size-4" />
            Acesso seguro
          </div>
          <div class="space-y-4">
            <h1 class="text-4xl font-bold tracking-tight text-white">Entre no painel da aplicação</h1>
            <p class="max-w-md text-sm leading-6 text-slate-400">
              Sessões, permissões e dados administrativos ficam protegidos pelo fluxo de autenticação do Better Auth.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3 text-xs text-slate-400">
          <div class="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <div class="text-slate-200 font-semibold">PostgreSQL</div>
            Persistência
          </div>
          <div class="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <div class="text-slate-200 font-semibold">Drizzle</div>
            Tipagem
          </div>
          <div class="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <div class="text-slate-200 font-semibold">Nuxt UI</div>
            Interface
          </div>
        </div>
      </section>

      <main class="flex min-h-screen flex-col bg-slate-950">
        <div class="flex items-center justify-between border-b border-slate-900 px-5 py-4 lg:hidden">
          <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm font-semibold text-slate-200">
            <span class="flex size-8 items-center justify-center rounded-lg bg-emerald-400 text-slate-950 font-black">N</span>
            NuxtTemplate
          </NuxtLink>
        </div>

        <div class="flex flex-1 items-center justify-center px-5 py-10">
          <div class="w-full max-w-md">
            <slot />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
