// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint'
  ],
  css: [
    '~/assets/css/main.css'
  ],
  runtimeConfig: {
    // Keys within public are also exposed client-side
    public: {
      authUrl: process.env.BETTER_AUTH_URL || 'http://localhost:3000'
    }
  },
  nitro: {
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
    compatibilityVersion: 4,
  },
  typescript: {
    typeCheck: true,
    strict: true
  }
})
