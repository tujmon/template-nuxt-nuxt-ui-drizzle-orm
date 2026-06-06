# Template Nuxt, Nuxt UI, Drizzle (PostgreSQL), Better-Auth & Zod

Este arquivo centraliza o mapeamento de documentação das diferentes camadas de arquivos do projeto template, facilitando o trabalho de desenvolvimento e a preservação de padrões.

## Links de Documentação dos Diretórios
Utilize os links abaixo para ler a finalidade de cada seção:

- [Tabelas de Banco de Dados & Conexão ORM](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/server/database/AGENT.md)
- [Criação de Handlers de API (Endpoints)](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/server/api/AGENT.md)
- [Camada de Lógica de Negócios (Services)](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/server/services/AGENT.md)
- [Validação Centralizada com Zod](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/shared/validation/AGENT.md)
- [Componentes UI & Padrões de Estilo](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/components/AGENT.md)
- [Páginas de Visualização e Rotas](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/pages/AGENT.md)
- [Padrões e Configuração de Testes de Integração](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/tests/AGENT.md)

## Configurações Principais
- **Instância Geral de Configuração**: [nuxt.config.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/nuxt.config.ts)
- **Configuração do ORM Drizzle Kit**: [drizzle.config.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/drizzle.config.ts)
- **Regras Globais de Qualidade de Código**: [eslint.config.js](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/eslint.config.js)
- **Configuração de Execução de Testes**: [vitest.config.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/vitest.config.ts)
- **Gatilho de Verificação Pré-Commit (Git Hook)**: Configurado automaticamente via `simple-git-hooks` e `lint-staged` no [package.json](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/package.json) para rodar a checagem de regras em arquivos modificados no commit.
