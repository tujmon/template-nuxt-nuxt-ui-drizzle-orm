# Testing Conventions

Este diretório contém os testes automatizados da aplicação usando **Vitest**, PostgreSQL real e **@nuxt/test-utils/e2e** para rotas HTTP.

## Scripts de Teste
- **Executar testes**: `npm run test` (executa os testes em modo "run single time").
- **Executar testes em modo Watch**: `npx vitest` (executa e escuta modificações nos arquivos).

## Ambiente
- O Vitest carrega `.env.test` automaticamente via [vitest.config.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/vitest.config.ts).
- `.env.test` usa `DATABASE_URL=postgresql://postgres:postgres@localhost:5433/db`.
- Suba o banco de teste com `POSTGRES_PORT=5433 npm run db:up`.
- Os arquivos de teste rodam sem paralelismo de arquivo para evitar disputa pelo mesmo pool/conexão.

## Testes de Integração

- Crie testes de serviços dentro de `tests/integration/`.
- Testes de service devem usar PostgreSQL real, rodar migrations no `beforeAll` e limpar tabelas entre casos.
- Evite mocks de `db` em testes chamados de integração. Se for mockar, coloque em `tests/unit/`.
- Feche o `pool` no `afterAll` quando o arquivo usar o client de banco diretamente.

## Testes E2E/API

- Crie testes de rotas em `tests/e2e/`.
- Use `setup` e `fetch` de `@nuxt/test-utils/e2e` para subir um servidor Nuxt temporário.
- Cubra status code, payload JSON e validação Zod dos endpoints.
- Para endpoints autenticados, cubra pelo menos a rejeição 401 e teste a lógica persistente no service enquanto não houver helper estável de sessão HTTP.

## Testes De Arquitetura

- Regras globais verificáveis ficam em `tests/architecture/`.
- Prefira testes de arquitetura para proteger invariantes simples de arquivo, import e localização.
- Quando uma exceção for legítima, documente primeiro em `docs/invariants.md` e depois ajuste o teste.
- Não remova uma regra de arquitetura só para fazer uma implementação local passar.
