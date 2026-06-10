# Template Nuxt Full-Stack

Este arquivo centraliza os padrões do template Nuxt 3 com Nuxt UI, PostgreSQL, Drizzle ORM, Better Auth, Zod, Vitest e Docker Compose.

## Documentação Principal
- [README.md](README.md): setup, scripts, rotas, testes e fluxo de desenvolvimento.
- [package.json](package.json): scripts oficiais do projeto.
- [.env.example](.env.example): variáveis de desenvolvimento.
- [.env.test](.env.test): variáveis versionadas para testes.
- [docker-compose.yml](docker-compose.yml): PostgreSQL local.
- [docs/invariants.md](docs/invariants.md): regras que não devem ser quebradas.
- [docs/agent-recipes.md](docs/agent-recipes.md): receitas para tarefas comuns.
- [docs/ui-standards.md](docs/ui-standards.md): padrões de interface, ações, botões, modais, feedback e fluxos.
- [.agents/skills/nuxt-server-creation/SKILL.md](.agents/skills/nuxt-server-creation/SKILL.md): skill para criação server-side, APIs, domínio, banco, seeds e testes.
- [.agents/skills/nuxt-ui-creation/SKILL.md](.agents/skills/nuxt-ui-creation/SKILL.md): skill para criação de páginas, componentes, fluxos e temas com Nuxt UI 4.

## Guias Por Diretório
- [server/database/AGENT.md](server/database/AGENT.md): conexão, schema, migrations e banco.
- [server/domain/AGENT.md](server/domain/AGENT.md): entidades, regras e interfaces (ports) de domínio.
- [server/infrastructure/AGENT.md](server/infrastructure/AGENT.md): implementações de repositórios (adapters) usando Drizzle.
- [server/api/AGENT.md](server/api/AGENT.md): endpoints, versionamento, autenticação e validação.
- [server/services/AGENT.md](server/services/AGENT.md): lógica de negócio.
- [shared/validation/AGENT.md](shared/validation/AGENT.md): schemas Zod compartilhados.
- [tests/AGENT.md](tests/AGENT.md): testes de integração e API.
- [app/pages/AGENT.md](app/pages/AGENT.md): páginas e auth por rota.
- [app/components/AGENT.md](app/components/AGENT.md): componentes Vue.
- [app/composables/AGENT.md](app/composables/AGENT.md): composables client-side.
- [app/middleware/AGENT.md](app/middleware/AGENT.md): middlewares Nuxt.
- [app/layouts/AGENT.md](app/layouts/AGENT.md): layouts e navegação autenticada.
- [app/utils/AGENT.md](app/utils/AGENT.md): utilitários client-side.
- [scripts/AGENT.md](scripts/AGENT.md): scripts operacionais.
- [types/AGENT.md](types/AGENT.md): augmentations TypeScript.

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
- Nuxt usa o diretório `app/`; não recrie diretórios legados na raiz como `pages/`, `components/`, `layouts/`, `middleware/`, `utils/` ou `assets/`.
- O Nuxt UI está na versão 4. Use APIs atuais como `UFormField`, `UTable :data`, `UDropdownMenu`, `USelect :items` e `UModal` com slots nomeados (`#content`, `#body`, etc.).
- O app deve permanecer envolvido por `UApp` em `app/app.vue`; isso habilita toasts, tooltips e overlays programáticos do Nuxt UI.
- Centralize tema em `app/themes/`: presets ficam em `app/themes/presets/`, `app/app.config.ts` apenas seleciona o tema ativo com `NUXT_UI_THEME`. Não espalhe decisões de marca em componentes individuais.
- Em UI nova, prefira classes semânticas do Nuxt UI (`text-default`, `text-muted`, `bg-elevated`, `border-muted`, `text-highlighted`) e props semânticas (`color="primary"`, `color="error"`). Evite palettes cruas como `slate`, `emerald`, `gray` e `zinc`, salvo em tokens globais ou casos visuais muito específicos.
- Use ícones `i-lucide-*` em novos componentes; mantenha outros conjuntos apenas quando já forem dependência explícita da tela.
- O Better Auth Admin está habilitado com banimento, roles e impersonation. Impersonation usa sessão temporária com `session.impersonatedBy`; mantenha essa coluna no schema/migrations.
- Antes de criar ou alterar interfaces, siga [docs/ui-standards.md](docs/ui-standards.md) para posicionamento de ações, hierarquia de botões, feedback e fluxos.

## Skills Do Projeto
- Use `nuxt-server-creation` para mudanças em `server/`, `shared/validation`, banco, seed, API, auth/admin server-side e testes de backend.
- Use `nuxt-ui-creation` para mudanças em `app/pages`, `app/components`, `app/composables`, layouts, temas, estados visuais, formulários, tabelas, modais e fluxos do usuário.
- Quando uma feature atravessar UI e servidor, carregue as duas skills e implemente em fatias verticais: contrato Zod, serviço/API, UI consumidora e testes.
- Consulte `nuxt-ui.md` como referência local da documentação do Nuxt UI, mas extraia apenas a seção do componente necessário para evitar copiar padrões de versões ou contextos não usados.

## Checklist Obrigatório Para Agentes
- Leia [docs/invariants.md](docs/invariants.md) antes de criar padrões novos.
- Use as receitas em [docs/agent-recipes.md](docs/agent-recipes.md) para endpoints, páginas, envs, seeds e schemas.
- Use [docs/ui-standards.md](docs/ui-standards.md) para mudanças visuais, fluxos do usuário e ações.
- Use as skills em `.agents/skills/` quando a tarefa for criação server-side ou criação de UI.
- Rode `npm run agent:check` antes de finalizar uma mudança.
- Se `agent:check` falhar por banco indisponível, suba `POSTGRES_PORT=5433 npm run db:up` e rode novamente.
- Não contorne testes de arquitetura sem atualizar explicitamente os invariantes do projeto.
