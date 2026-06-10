# Layouts Directory

Este diretório contém layouts Nuxt reutilizados por páginas.

## Estrutura Atual
- [default.vue](app/layouts/default.vue): Layout principal com navegação, sessão, banner de impersonation e conteúdo autenticado/público.
- [auth.vue](app/layouts/auth.vue): Layout compacto para login e cadastro.

## Padrões Recomendados
- Layouts devem orquestrar estrutura visual ampla, não regras de negócio.
- Não duplique lógica de proteção de rota em layouts; use `definePageMeta({ auth })` e o middleware global.
- Mantenha chamadas de sessão em layout apenas quando a navegação precisa reagir ao usuário autenticado, utilizando sempre o composable `useAuthSession` para evitar requisições redundantes.
- Quando `session.session.impersonatedBy` existir, o layout deve mostrar um banner claro de impersonation e oferecer `Voltar ao admin` via `authClient.admin.stopImpersonating()`.
- Depois de parar impersonation, prefira navegação completa para `/admin` quando necessário, pois cookies de sessão foram trocados.
- Evite colocar cards dentro de cards; layouts devem ser superfícies amplas e estáveis.
- Layouts devem usar tokens semânticos do Nuxt UI (`bg-default`, `bg-elevated`, `border-muted`, `text-default`) para que mudanças em `app.config.ts` propaguem sem refatoração visual.
- Não remova o wrapper global `UApp` de `app/app.vue`.
