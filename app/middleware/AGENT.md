# Middleware Directory

Este diretório contém middlewares de rota do Nuxt.

## Estrutura Atual
- [auth.global.ts](app/middleware/auth.global.ts): Middleware global de autenticação baseado em `definePageMeta`.
- [admin.ts](app/middleware/admin.ts): Middleware de role admin para páginas administrativas.

## Padrões Recomendados
- Configure acesso por página com `definePageMeta({ auth: 'public' | 'guest' | 'protected' })`.
- Quando `auth` for omitido, o middleware assume `protected`.
- `public`: disponível para qualquer usuário.
- `guest`: disponível apenas sem sessão; usuários autenticados são enviados para `/dashboard`.
- `protected`: exige sessão; usuários sem sessão são enviados para `/login`.
- Não mantenha listas fixas de paths públicos no middleware. A configuração deve ficar na própria página.
- Utilize o composable `useAuthSession` para checar e ler os dados da sessão do usuário no middleware, garantindo a desduplicação correta e segurança do SSR.
- Páginas administrativas devem combinar `definePageMeta({ auth: 'protected', middleware: 'admin' })`; não copie a regra de role diretamente na página.
