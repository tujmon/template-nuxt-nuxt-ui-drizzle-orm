# Testing Conventions

Este diretório contém os testes automatizados da aplicação usando **Vitest**, PostgreSQL real e **@nuxt/test-utils/e2e** para rotas HTTP.

## Scripts de Teste
- **Executar testes**: `npm run test` (executa os testes em modo "run single time").
- **Executar testes em modo Watch**: `npx vitest` (executa e escuta modificações nos arquivos).

## Ambiente
- O Vitest carrega `.env.test` automaticamente via [vitest.config.ts](vitest.config.ts).
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
- Para endpoints autenticados, teste a rejeição 401. Para testar o fluxo autenticado (200 OK) sem suporte a cookies na biblioteca E2E padrão:
  1. Use o client do banco (`db`) no próprio bloco de testes para cadastrar um usuário mock de forma síncrona.
  2. Simule a sessão HTTP injetando dados ou crie cookies válidos simulando a assinatura que o Better Auth espera no cabeçalho `Cookie` do `fetch()`, ou mocke o comportamento de `requireUserSession` nas configurações do Vitest usando `vi.mock()`.
  3. Garanta que o service subjacente de validação de permissões do usuário seja coberto exaustivamente nos testes de integração (`tests/integration/`).

## Testes De Arquitetura

- Regras globais verificáveis ficam em `tests/architecture/`.
- Prefira testes de arquitetura para proteger invariantes simples de arquivo, import e localização.
- Quando uma exceção for legítima, documente primeiro em `docs/invariants.md` e depois ajuste o teste.
- Não remova uma regra de arquitetura só para fazer uma implementação local passar.
