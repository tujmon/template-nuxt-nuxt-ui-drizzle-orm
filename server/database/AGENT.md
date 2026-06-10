# Database & ORM Directory

Este diretório gerencia toda a persistência de dados do template, integrando o **Drizzle ORM** com **PostgreSQL**.

## Estrutura do Diretório
- [client.ts](server/database/client.ts): Inicializa o pool de conexão `pg` e expõe `pool` e `db`.
- **schema/**: Contém as tabelas e relacionamentos do banco de dados:
  - [auth.ts](server/database/schema/auth.ts): Tabelas necessárias para o ecossistema do Better-Auth.
  - [scheduler.ts](server/database/schema/scheduler.ts): Tabela de travas (locks) e controle do scheduler de tarefas.
  - [index.ts](server/database/schema/index.ts): Exportador central das tabelas do banco de dados.
- **migrations/**: Contém os arquivos SQL gerados pelo Drizzle Kit para controle de versão do banco de dados.

## Ambiente Local
- O PostgreSQL local é definido em [docker-compose.yml](docker-compose.yml).
- Use `npm run db:up` para subir o banco padrão em `localhost:5432`.
- Para testes, use `POSTGRES_PORT=5433 npm run db:up`; o arquivo `.env.test` aponta para `localhost:5433`.

## Padrões Recomendados
- Adicione novas tabelas criando um arquivo descritivo sob `schema/` (ex: `posts.ts`) e exporte-o no `index.ts`.
- Sempre execute `npm run db:generate` para criar as novas migrações SQL.
- Aplique migrations com `npm run db:migrate`.
- Popule dados locais com `npm run db:seed`. O seed é idempotente e cria uma conta Better Auth `credential`.
- Não crie clientes paralelos de banco em handlers ou services; reutilize `db` para ORM e `pool` somente quando uma query SQL operacional direta for necessária.
- Para operações que alteram múltiplas tabelas ou exigem consistência transacional forte em nível de negócio, utilize o utilitário de transação runtime importado de `server/database/transaction.ts` com a função `runInTransaction(async (tx) => { ... })`. Repositórios e serviços que operam de forma transacional devem aceitar um cliente `tx` (tipo `TransactionClient`) opcional.
- O plugin Better Auth Admin adiciona campos administrativos no schema de auth. A tabela `user` mantém `role`, `banned`, `ban_reason` e `ban_expires`; a tabela `session` mantém `impersonated_by` para sessões de impersonation.
- Se recursos do Better Auth adicionarem campos ao schema, atualize `server/database/schema/auth.ts`, rode `npm run db:generate` e aplique a migration antes de validar no browser.

