# Server Utils Directory

Este diretório contém utilitários server-side compartilhados por handlers, services e infraestrutura.

## Estrutura Atual
- [auth.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/server/utils/auth.ts): Configuração Better Auth com adapter Drizzle.
- [env.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/server/utils/env.ts): Validação Zod das variáveis de ambiente do servidor.
- [rate-limit.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/server/utils/rate-limit.ts): Rate limit simples em memória por IP.
- [logger.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/server/utils/logger.ts): Sistema de logs estruturado baseado em `consola`.
- [scheduler.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/server/utils/scheduler.ts): Utilitário de execução de tarefas programadas com controle de trava (concurrency lock) e diagnósticos persistidos em banco.

## Padrões Recomendados
- Valide novas envs em `env.ts` antes de usar em código servidor.
- Não leia `process.env` diretamente em handlers/services quando a variável fizer parte da configuração do app.
- Use `auth.api.getSession` em handlers que precisam de sessão.
- O rate limit em memória (`rate-limit.ts`) é adequado para desenvolvimento/MVP e possui um mecanismo de limpeza preguiçosa (lazy cleanup) periódico para evitar memory leaks. Para produção distribuída (multi-instância), substitua por um storage compartilhado como Redis.
- Use o logger estruturado (`logger.ts`) em handlers e services para registrar operações relevantes e erros em produção (no formato JSON) e desenvolvimento (pretty logs). Utilize `useLogger(event)` em handlers de API para rastrear logs correlacionados com o `requestId` e `userId`.
- Envolva a execução de qualquer tarefa em segundo plano (Nitro Task) em `runTaskWithGuardrails` do `scheduler.ts` para garantir consistência e travamento de concorrência persistido em banco de dados, além de reportar automaticamente métricas e erros.
