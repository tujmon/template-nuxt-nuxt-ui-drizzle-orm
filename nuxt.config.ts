// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint'
  ],
  runtimeConfig: {
    // Keys within public are also exposed client-side
    public: {
      authUrl: process.env.BETTER_AUTH_URL || 'http://localhost:3000'
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
