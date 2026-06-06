# Database & ORM Directory

Este diretório gerencia toda a persistência de dados do template, integrando o **Drizzle ORM** com **PostgreSQL**.

## Estrutura do Diretório
- [client.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/server/database/client.ts): Inicializa o pool de conexão utilizando o driver `pg` e expõe a instância `db`.
- **schema/**: Contém as tabelas e relacionamentos do banco de dados:
  - [auth.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/server/database/schema/auth.ts): Tabelas necessárias para o ecossistema do Better-Auth.
  - [index.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/server/database/schema/index.ts): Exportador central das tabelas do banco de dados.
- **migrations/**: Contém os arquivos SQL gerados pelo Drizzle Kit para controle de versão do banco de dados.

## Padrões Recomendados
- Adicione novas tabelas criando um arquivo descritivo sob `schema/` (ex: `posts.ts`) e exporte-o no `index.ts`.
- Sempre execute `npm run db:generate` para criar as novas migrações SQL.
