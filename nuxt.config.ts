// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/fonts', '@nuxt/eslint'],
  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Nuxt 4 Full-Stack Template',
      meta: [
        {
          name: 'description',
          content:
            'Template opinativo com Nuxt 4, Nuxt UI, Drizzle ORM, Better Auth e Zod. Projetado para segurança, velocidade e tipagem estrita de ponta a ponta.'
        },
        { name: 'theme-color', content: '#0f172a' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Nuxt 4 Full-Stack Template' },
        {
          property: 'og:description',
          content: 'Template opinativo com Nuxt 4, Nuxt UI, Drizzle ORM, Better Auth e Zod.'
        },
        { name: 'twitter:card', content: 'summary' }
      ],
      link: []
    }
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    // Keys within public are also exposed client-side
    public: {
      authUrl: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
      uiTheme: process.env.NUXT_UI_THEME || 'default'
    }
  },
  nitro: {
    experimental: {
      tasks: true
    },
    scheduledTasks: {
      // Run daily at midnight to remove expired database sessions
      '0 0 * * *': ['cleanup-sessions']
    },
    routeRules: {
      '/**': {
        headers: {
          'x-content-type-options': 'nosniff',
          'x-frame-options': 'DENY',
          'referrer-policy': 'strict-origin-when-cross-origin',
          'permissions-policy': 'camera=(), microphone=(), geolocation=()'
        }
      }
    }
  },
  future: {
    compatibilityVersion: 4
  },
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'better-auth/client/plugins',
        'better-auth/vue',
        'zod'
      ]
    }
  },
  typescript: {
    typeCheck: true,
    strict: true
  }
})
