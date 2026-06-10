<template>
  <div class="min-h-screen bg-default text-default">
    <div class="min-h-screen grid lg:grid-cols-[minmax(0,1fr)_480px]">
      <section class="hidden lg:flex flex-col justify-between border-r border-muted bg-elevated px-10 py-8">
        <NuxtLink to="/" class="inline-flex items-center gap-3 text-sm font-semibold text-highlighted">
          <span class="flex size-9 items-center justify-center rounded-lg bg-primary text-inverted font-black">N</span>
          NuxtTemplate
        </NuxtLink>

        <div class="max-w-xl space-y-6">
          <div class="inline-flex items-center gap-2 rounded-full border border-accented bg-accented px-3 py-1 text-xs font-medium text-highlighted">
            <UIcon name="i-lucide-shield-check" class="size-4" />
            Acesso seguro
          </div>
          <div class="space-y-4">
            <h1 class="text-4xl font-bold tracking-tight text-highlighted">Entre no painel da aplicação</h1>
            <p class="max-w-md text-sm leading-6 text-muted">
              Sessões, permissões e dados administrativos ficam protegidos pelo fluxo de autenticação do Better Auth.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3 text-xs text-muted">
          <div class="rounded-lg border border-muted bg-default/60 p-3">
            <div class="text-highlighted font-semibold">PostgreSQL</div>
            Persistência
          </div>
          <div class="rounded-lg border border-muted bg-default/60 p-3">
            <div class="text-highlighted font-semibold">Drizzle</div>
            Tipagem
          </div>
          <div class="rounded-lg border border-muted bg-default/60 p-3">
            <div class="text-highlighted font-semibold">Nuxt UI</div>
            Interface
          </div>
        </div>
      </section>

      <main class="flex min-h-screen flex-col bg-default">
        <div class="flex items-center justify-between border-b border-muted px-5 py-4 lg:hidden">
          <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm font-semibold text-highlighted">
            <span class="flex size-8 items-center justify-center rounded-lg bg-primary text-inverted font-black">N</span>
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
