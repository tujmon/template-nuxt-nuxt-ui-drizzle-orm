# Scripts Directory

Este diretório contém scripts operacionais executados via npm.

## Estrutura Atual
- [cdd-report.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/scripts/cdd-report.ts): Relatório CDD baseado em `fallow health`.
- **seed/**: Scripts modulares de seed.
  - [index.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/scripts/seed/index.ts): Runner CLI dos seeds.
  - [cli.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/scripts/seed/cli.ts): Parsing de argumentos e saída do CLI.
  - [env.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/scripts/seed/env.ts): Carregamento de `.env` e configuração.
  - [database.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/scripts/seed/database.ts): Pool e transação.
  - [types.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/scripts/seed/types.ts): Contratos compartilhados do seed.
  - [system.seed.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/scripts/seed/system.seed.ts): Dados obrigatórios de sistema.
  - [demo.seed.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/scripts/seed/demo.seed.ts): Dados de demonstração.
  - [auth.seed.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/scripts/seed/auth.seed.ts): Seed de usuário credential compatível com Better Auth.

## Padrões Recomendados
- Scripts devem carregar `.env` por padrão e permitir override explícito quando necessário.
- Scripts operacionais devem ser TypeScript e rodar via `tsx` nos comandos npm.
- O seed aceita `SEED_ENV_FILE=.env.test` para rodar contra o banco de teste.
- Seeds recusam execução com `NODE_ENV=production`, salvo `ALLOW_PRODUCTION_SEED=true`.
- Separe dados obrigatórios em `system.seed.ts` e dados fictícios em `demo.seed.ts`.
- Seeds devem ser idempotentes, usar transação e `ON CONFLICT` quando possível.
- Para usuários Better Auth, use `hashPassword` de `better-auth/crypto`; não crie hash manual.
- Scripts CLI podem usar `console`, mas mantenha `/* eslint-disable no-console */` local ao arquivo.
- Scripts de análise devem preferir modo report-only por padrão e ter modo de falha explícito para CI.
