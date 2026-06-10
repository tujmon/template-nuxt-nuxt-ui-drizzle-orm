# Pages & Routing Directory

Este diretório contém os componentes que formam as páginas e geram automaticamente a árvore de rotas da aplicação através do Nuxt Routing.

## Estrutura do Diretório
- [index.vue](app/pages/index.vue): Página inicial/pública do template.
- [login.vue](app/pages/login.vue): Página de autenticação do usuário.
- [register.vue](app/pages/register.vue): Página de cadastro.
- **dashboard/**: Sub-árvore de páginas protegidas.
  - [index.vue](app/pages/dashboard/index.vue): Dashboard principal de visualização de sessão protegida.
- **admin/**: Sub-árvore de administração.
  - [index.vue](app/pages/admin/index.vue): Painel admin para listar usuários, alterar roles, banir/desbanir e iniciar impersonation.

## Padrões Recomendados
- **Proteção de Acesso**: A proteção de rotas é gerenciada globalmente pelo middleware [auth.global.ts](app/middleware/auth.global.ts), mas cada página configura seu comportamento via `definePageMeta({ auth: 'public' | 'guest' | 'protected' })`. Quando omitido, o padrão é `protected`.
- **Admin**: `/admin` deve declarar `middleware: 'admin'` além de `auth: 'protected'`. Não duplique a regra de role na página.
- **Tamanho dos Arquivos**: Mantenha as páginas limpas e focadas na orquestração de layouts e chamadas a serviços/composables. Extraia trechos de UI complexos para sub-componentes especializados.
- **Padrão de UI**: Use [docs/ui-standards.md](docs/ui-standards.md) antes de posicionar ações de página, CTAs, tabelas, modais ou feedback.
- **Tema**: Não hardcode palettes de marca em páginas. Use classes semânticas do Nuxt UI e centralize mudanças globais de aparência em `app.config.ts`.
- **SEO por Rota**: Use `useSeoMeta` para definir título e descrição específicos em cada página. Em páginas privadas/autenticadas (ex: `/dashboard`), use `robots: 'noindex, nofollow'` para evitar indexação desnecessária por motores de busca.
