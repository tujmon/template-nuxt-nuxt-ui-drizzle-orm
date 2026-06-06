# Client Utils Directory

Este diretório contém utilitários compartilhados do lado do cliente.

## Estrutura Atual
- [auth-client.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/utils/auth-client.ts): Cliente Better Auth para Vue.

## Padrões Recomendados
- Mantenha utilitários client-side separados de `server/utils`.
- Não importe código server-side neste diretório.
- Prefira wrappers pequenos sobre bibliotecas externas, preservando a API original quando isso facilitar manutenção.
- Para lógica reativa, prefira `composables/`; para clientes ou helpers puros, use `utils/`.
