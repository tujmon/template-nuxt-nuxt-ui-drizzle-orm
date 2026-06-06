# Server Utils Directory

Este diretório contém utilitários server-side compartilhados por handlers, services e infraestrutura.

## Estrutura Atual
- [auth.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/server/utils/auth.ts): Configuração Better Auth com adapter Drizzle.
- [env.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/server/utils/env.ts): Validação Zod das variáveis de ambiente do servidor.
- [rate-limit.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/server/utils/rate-limit.ts): Rate limit simples em memória por IP.

## Padrões Recomendados
- Valide novas envs em `env.ts` antes de usar em código servidor.
- Não leia `process.env` diretamente em handlers/services quando a variável fizer parte da configuração do app.
- Use `auth.api.getSession` em handlers que precisam de sessão.
- O rate limit atual é adequado para desenvolvimento/MVP; para produção distribuída, substitua por storage compartilhado como Redis.
