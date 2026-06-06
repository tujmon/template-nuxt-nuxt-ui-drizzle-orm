# Middleware Directory

Este diretório contém middlewares de rota do Nuxt.

## Estrutura Atual
- [auth.global.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/middleware/auth.global.ts): Middleware global de autenticação baseado em `definePageMeta`.

## Padrões Recomendados
- Configure acesso por página com `definePageMeta({ auth: 'public' | 'guest' | 'protected' })`.
- Quando `auth` for omitido, o middleware assume `protected`.
- `public`: disponível para qualquer usuário.
- `guest`: disponível apenas sem sessão; usuários autenticados são enviados para `/dashboard`.
- `protected`: exige sessão; usuários sem sessão são enviados para `/login`.
- Não mantenha listas fixas de paths públicos no middleware. A configuração deve ficar na própria página.
