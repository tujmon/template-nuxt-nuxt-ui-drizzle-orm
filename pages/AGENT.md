# Pages & Routing Directory

Este diretório contém os componentes que formam as páginas e geram automaticamente a árvore de rotas da aplicação através do Nuxt Routing.

## Estrutura do Diretório
- [index.vue](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/pages/index.vue): Página inicial/pública do template.
- [login.vue](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/pages/login.vue): Página de autenticação do usuário.
- [register.vue](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/pages/register.vue): Página de cadastro.
- **dashboard/**: Sub-árvore de páginas de administração.
  - [index.vue](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/pages/dashboard/index.vue): Dashboard principal de visualização de sessão protegida.

## Padrões Recomendados
- **Proteção de Acesso**: A proteção de rotas é gerenciada globalmente pelo middleware [auth.global.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/middleware/auth.global.ts), mas cada página configura seu comportamento via `definePageMeta({ auth: 'public' | 'guest' | 'protected' })`. Quando omitido, o padrão é `protected`.
- **Tamanho dos Arquivos**: Mantenha as páginas limpas e focadas na orquestração de layouts e chamadas a serviços/composables. Extraia trechos de UI complexos para sub-componentes especializados.
