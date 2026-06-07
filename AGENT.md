# Template Nuxt Full-Stack

Este arquivo centraliza os padrões do template Nuxt 3 com Nuxt UI, PostgreSQL, Drizzle ORM, Better Auth, Zod, Vitest e Docker Compose.

## Documentação Principal
- [README.md](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/README.md): setup, scripts, rotas, testes e fluxo de desenvolvimento.
- [package.json](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/package.json): scripts oficiais do projeto.
- [.env.example](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/.env.example): variáveis de desenvolvimento.
- [.env.test](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/.env.test): variáveis versionadas para testes.
- [docker-compose.yml](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/docker-compose.yml): PostgreSQL local.
- [docs/invariants.md](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/docs/invariants.md): regras que não devem ser quebradas.
- [docs/agent-recipes.md](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/docs/agent-recipes.md): receitas para tarefas comuns.

## Guias Por Diretório
- [server/database/AGENT.md](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/server/database/AGENT.md): conexão, schema, migrations e banco.
- [server/api/AGENT.md](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/server/api/AGENT.md): endpoints, versionamento, autenticação e validação.
- [server/services/AGENT.md](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/server/services/AGENT.md): lógica de negócio.
- [shared/validation/AGENT.md](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/shared/validation/AGENT.md): schemas Zod compartilhados.
- [tests/AGENT.md](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/tests/AGENT.md): testes de integração e API.
- [pages/AGENT.md](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/pages/AGENT.md): páginas e auth por rota.
- [components/AGENT.md](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/components/AGENT.md): componentes Vue.
- [composables/AGENT.md](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/composables/AGENT.md): composables client-side.
- [middleware/AGENT.md](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/middleware/AGENT.md): middlewares Nuxt.
- [scripts/AGENT.md](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/scripts/AGENT.md): scripts operacionais.
- [types/AGENT.md](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/types/AGENT.md): augmentations TypeScript.

## Comandos Canônicos
- `npm run db:up`: sobe o PostgreSQL local.
- `npm run db:migrate`: aplica migrations.
- `npm run db:seed`: cria usuário demo idempotente.
- `npm test`: roda integração Postgres e E2E de API.
- `npm run lint`: ESLint e Fallow sem ruído.
- `npm run fallow:health`: relatório consultivo de complexidade, hotspots e gaps.
- `npm run fallow:fix:dry`: prévia segura de limpezas automáticas.
- `npm run cdd:report`: relatório de ICP inspirado em Cognitive-Driven Development.
- `npm run cdd:check`: falha se algum arquivo ultrapassar `CDD_ICP_LIMIT`.
- `npm run build`: build Nuxt/Nitro com typecheck.
- `npm run agent:check`: validação completa para agentes antes de finalizar.

## Regras Globais
- APIs de aplicação devem ficar em `/api/v1`, exceto rotas internas de auth e endpoints técnicos explicitamente documentados.
- Payloads de APIs devem ser validados com Zod em `shared/validation`.
- Regras de negócio devem ficar em services; handlers atuam como controladores.
- Testes que tocam banco usam `.env.test` e o PostgreSQL em `localhost:5433`.
- Não introduza logs de console em código de app; scripts CLI podem usar `console` com justificativa local.
- Use Fallow para proteger o template contra dependências não usadas, exports mortos, duplicação e crescimento acidental de complexidade.
- Use o relatório CDD para impedir concentração de carga cognitiva por arquivo antes de refatorações crescerem.

## Checklist Obrigatório Para Agentes
- Leia [docs/invariants.md](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/docs/invariants.md) antes de criar padrões novos.
- Use as receitas em [docs/agent-recipes.md](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/docs/agent-recipes.md) para endpoints, páginas, envs, seeds e schemas.
- Rode `npm run agent:check` antes de finalizar uma mudança.
- Se `agent:check` falhar por banco indisponível, suba `POSTGRES_PORT=5433 npm run db:up` e rode novamente.
- Não contorne testes de arquitetura sem atualizar explicitamente os invariantes do projeto.
