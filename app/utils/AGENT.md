# Client Utils Directory

Este diretório contém utilitários compartilhados do lado do cliente.

## Estrutura Atual
- [auth-client.ts](app/utils/auth-client.ts): Cliente Better Auth para Vue com plugin `adminClient`.

## Padrões Recomendados
- Mantenha utilitários client-side separados de `server/utils`.
- Não importe código server-side neste diretório.
- Prefira wrappers pequenos sobre bibliotecas externas, preservando a API original quando isso facilitar manutenção.
- Para lógica reativa, prefira `composables/`; para clientes ou helpers puros, use `utils/`.
- Mantenha `adminClient()` habilitado para recursos do painel admin como listagem, roles, banimento e impersonation.
