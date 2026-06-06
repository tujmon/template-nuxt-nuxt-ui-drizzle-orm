# Integration Testing Conventions

Este diretório contém os testes automatizados da aplicação, focando principalmente em **Testes de Integração** utilizando **Vitest** e **@nuxt/test-utils**.

## Scripts de Teste
- **Executar testes**: `npm run test` (executa os testes em modo "run single time").
- **Executar testes em modo Watch**: `npx vitest` (executa e escuta modificações nos arquivos).

## Padrão para Criação de Testes de Integração

### 1. Ambiente Nuxt Integrado
Sempre utilize a biblioteca `@nuxt/test-utils` para inicializar o contexto do Nuxt 3 (como injeção de composables, imports automáticos e roteamento). O arquivo de configuração central do Vitest é o [vitest.config.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/vitest.config.ts).

### 2. Testando Serviços do Servidor (`server/services/`)
- Crie testes de serviços dentro de `tests/integration/`.
- **Validação de Banco de Dados**:
  - Para testes que necessitam persistir informações reais no PostgreSQL, isole cada teste dentro de blocos de **Transação com Rollback** (`db.transaction()`) do Drizzle ORM, revertendo a inserção no final do bloco para evitar poluição do banco.
  - Para testes de fluxo que não dependem da infraestrutura de rede externa do banco, utilize os stubs e spies do `vi.spyOn(db, 'select')` para validar se as consultas SQL corretas estão sendo invocadas e mapeadas pelo serviço.

### 3. Testando Rotas de API (`server/api/`)
Para rotas de API do servidor, você pode disparar requisições utilizando o método helper `$fetch` provido pelo `@nuxt/test-utils/e2e`.
- Crie um arquivo com a extensão `.spec.ts` ou `.test.ts`.
- Use a suite de E2E do `@nuxt/test-utils` para subir um servidor temporário da aplicação Nuxt de forma ágil e testar a resposta HTTP de ponta a ponta.
