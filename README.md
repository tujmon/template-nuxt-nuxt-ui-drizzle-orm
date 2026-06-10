# Nuxt 4 Full-Stack Template

Template opinativo com Nuxt 4, Nuxt UI, Drizzle ORM, PostgreSQL, Better Auth, Zod, Vitest e Docker Compose.

## Stack

- Nuxt 4 + Vue 3
- Nuxt UI
- Better Auth com adapter Drizzle
- PostgreSQL
- Drizzle ORM e Drizzle Kit
- Zod para validação compartilhada entre cliente e servidor
- Vitest para testes de integração e API
- ESLint + Fallow para qualidade e detecção de código morto

## Setup

Instale as dependências:

```bash
npm install
```

Crie o arquivo local de desenvolvimento:

```bash
cp .env.example .env
```

Em produção, gere um `BETTER_AUTH_SECRET` forte e único. Não reutilize os valores de exemplo ou de teste.

Suba o PostgreSQL:

```bash
npm run db:up
```

Rode as migrations:

```bash
npm run db:migrate
```

Popule o banco com um usuário demo:

```bash
npm run db:seed
```

Credenciais padrão:

```txt
demo@example.com / password123
```

Inicie o app:

```bash
npm run dev
```

O seed é idempotente: pode ser executado novamente sem duplicar o usuário demo. Para customizar as credenciais, defina `SEED_USER_EMAIL`, `SEED_USER_NAME` e `SEED_USER_PASSWORD` no ambiente antes de rodar o script.
Os scripts operacionais ficam em TypeScript em `scripts/` e são executados via `tsx` pelos comandos npm.

Para rodar o seed contra o banco de teste/versionado em `.env.test`:

```bash
SEED_ENV_FILE=.env.test npm run db:seed
```

Comandos de seed disponíveis:

```bash
npm run db:seed
npm run db:seed:system
npm run db:seed:demo
npm run db:seed:reset
```

## Testes

O arquivo `.env.test` é versionado para padronizar o banco dos testes. Ele usa `localhost:5433`, útil quando uma instância local já ocupa `5432`.

Suba o banco de teste:

```bash
POSTGRES_PORT=5433 npm run db:up
```

Execute a suíte:

```bash
npm test
```

Além dos testes de integração e API, `tests/architecture` protege invariantes do template, como versionamento de rotas, uso de Zod no servidor, env centralizado e pages com `definePageMeta`.

## Screenshots

Gere screenshots de todas as páginas descobertas em `app/pages`:

```bash
npm run screenshots
```

O comando salva os arquivos em `screenshots/`, pasta ignorada pelo Git. Por padrão, ele captura uma sessão pública, uma sessão `user` com `demo@example.com / password123` e uma sessão `admin` com `admin@example.com / admin123`.

Configurações úteis:

```bash
SCREENSHOT_BASE_URL=http://127.0.0.1:3000 npm run screenshots
SCREENSHOT_USERS='[{"name":"qa","email":"qa@example.com","password":"secret"}]' npm run screenshots
SCREENSHOT_ROUTE_PARAMS='{"id":"seed_user_demo"}' npm run screenshots
SCREENSHOT_OUTPUT_DIR=screenshots-local npm run screenshots
```

Se `SCREENSHOT_BASE_URL` já estiver respondendo, o script usa o servidor existente. Caso contrário, ele inicia o Nuxt dev server automaticamente.

Para uma captura reprodutível com banco próprio, build de produção, migrations, seed reset e healthcheck antes dos prints, use o compose isolado:

```bash
npm run screenshots:docker
```

Esse fluxo usa `docker-compose.screenshots.yml`, sobe Postgres em `SCREENSHOT_DOCKER_DB_PORT` (`55432` por padrão), publica o app em `SCREENSHOT_DOCKER_APP_PORT` (`3300` por padrão), roda `npm ci`, `db:migrate`, `db:seed:reset`, `build`, espera `/api/v1/status` responder e então captura as páginas. Para validar todos os temas no mesmo modelo isolado:

```bash
npm run screenshots:themes:docker
```

Variáveis úteis:

```bash
NUXT_UI_THEME=sunset npm run screenshots:docker
SCREENSHOT_THEMES=default,sunset npm run screenshots:themes:docker
SCREENSHOT_DOCKER_APP_PORT=3310 SCREENSHOT_DOCKER_DB_PORT=55433 npm run screenshots:docker
SCREENSHOT_DOCKER_KEEP_ALIVE=true npm run screenshots:docker
```

## Qualidade

```bash
npm run lint
npm run build
```

Para agentes de IA ou mudanças maiores, rode a validação completa:

```bash
npm run agent:check
```

O lint combina ESLint e Fallow:

```bash
npm run lint:eslint
npm run lint:fallow
```

Comandos úteis do Fallow:

```bash
npm run fallow:dead-code
npm run fallow:dupes
npm run fallow:health
npm run fallow:production
npm run fallow:fix:dry
```

Use `fallow:health` como relatório consultivo de complexidade e hotspots, e `fallow:fix:dry` antes de aceitar qualquer limpeza automática.

O Fallow reconhece automaticamente plugins do projeto como Nuxt, Vitest, ESLint, TypeScript, Drizzle e hooks de Git. A configuração local complementa isso com entradas explícitas para scripts e testes.

## CDD

O template inclui um relatório inspirado em Cognitive-Driven Development (CDD), usando métricas do `fallow health` para aproximar Pontos de Complexidade Intrínseca (ICP) por arquivo:

```bash
npm run cdd:report
CDD_ICP_LIMIT=20 npm run cdd:check
```

O cálculo considera decisões/branches, carga cognitiva, acoplamento, funções grandes e risco sem cobertura. Use o relatório para espalhar complexidade entre unidades menores antes que um arquivo concentre entendimento demais.

## Rotas E API

As páginas configuram acesso com `definePageMeta`:

```ts
definePageMeta({
  auth: 'public' // public | guest | protected
})
```

O middleware global usa `protected` como padrão quando `auth` é omitido.

Endpoints versionados ficam em `server/api/v1`. O template inclui:

- `GET /api/v1/status`: health/status operacional com dados básicos da dependência PostgreSQL.
- `PATCH /api/v1/users/profile`: exige sessão, valida o payload com Zod e delega a atualização para `UserService`.
- `POST /api/telemetry/performance`: endpoint opcional para receber métricas validadas de performance.

Por segurança, os detalhes do banco em `/api/v1/status` só são expostos quando `STATUS_EXPOSE_DETAILS="true"`.

## Guardrails Para Agentes

- [docs/invariants.md](docs/invariants.md): regras que não devem ser quebradas sem decisão explícita.
- [docs/agent-recipes.md](docs/agent-recipes.md): receitas para endpoints, páginas, envs, seeds e schemas.
- `npm run agent:check`: lint, testes, CDD check e build em um único comando.

## Segurança

- Variáveis de ambiente do servidor são validadas com Zod em `server/utils/env.ts`.
- Headers básicos de segurança são configurados no Nitro.
- Endpoints sensíveis usam rate limit em memória por IP.
- O seed recusa execução com `NODE_ENV=production`, salvo quando `ALLOW_PRODUCTION_SEED=true`.
- O endpoint de telemetria é validado com Zod e rate limit próprio.

## Performance

Use `usePerformanceMeasure` para medir ações de UI sem gerar ruído de console:

```ts
const performanceMeasure = usePerformanceMeasure()

await performanceMeasure.trackAsync('user-login-attempt', async () => {
  // ação medida
})
```

Para enviar a métrica ao endpoint opcional:

```ts
await performanceMeasure.trackAsync('user-login-attempt', action, {
  thresholdMs: 500,
  report: true
})
```
