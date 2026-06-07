# Project Invariants

Estas regras existem para evitar mudanças locais que quebram o desenho global do template.

## API

- Toda API de aplicação deve ficar em `server/api/v1`.
- Exceções sem `/v1` precisam estar documentadas. Hoje as exceções são `server/api/auth` e `server/api/telemetry`.
- Handlers de API devem agir como controladores: autenticar, validar, aplicar rate limit e delegar regra de negócio.
- Payload externo deve ser validado no servidor com Zod vindo de `shared/validation`.
- Handlers não devem acessar `server/database/client` diretamente, exceto endpoints operacionais como `GET /api/v1/status`.

## Auth E Rotas

- Toda página em `pages/` deve declarar `definePageMeta({ auth })`.
- Valores válidos de `auth`: `public`, `guest`, `protected`.
- O middleware global assume `protected` quando o meta é omitido, mas páginas novas ainda devem ser explícitas.

## Configuração

- Código de servidor deve usar `server/utils/env.ts` para variáveis de ambiente.
- Não leia `process.env` diretamente em handlers, services ou database client.
- Variáveis novas precisam aparecer em `.env.example` e `.env.test`.
- `.env.test` é versionado e deve continuar seguro para teste local.

## Banco E Seeds

- Seeds devem ser idempotentes, transacionais e bloqueados em produção por padrão.
- Scripts operacionais ficam em TypeScript e rodam via `tsx`.
- Dados obrigatórios ficam em `system.seed.ts`; dados fictícios ficam em `demo.seed.ts`.
- Usuários Better Auth devem usar `hashPassword` de `better-auth/crypto`.

## Qualidade

- Código runtime não deve usar `console`.
- Scripts CLI podem usar `console` com `/* eslint-disable no-console */` local.
- Rode `npm run agent:check` antes de finalizar mudanças.
- Use `npm run cdd:check` quando mexer em lógica, fluxo ou scripts.
