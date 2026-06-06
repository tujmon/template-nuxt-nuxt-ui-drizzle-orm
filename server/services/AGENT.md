# Business Logic Services Directory

Este diretório contém toda a lógica de negócios e manipulações complexas de dados do servidor do template.

## Estrutura do Diretório
- [base.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/server/services/base.ts): Classe base de serviço injetando o cliente `db` do Drizzle.
- [user.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/server/services/user.ts): Serviço específico para lógica e consultas de usuários.

## Padrões Recomendados
- Toda a lógica de leitura, escrita e regras de negócio complexas deve residir em classes de serviço.
- As rotas de API da pasta `server/api/` devem apenas validar os parâmetros de entrada e chamar o respectivo serviço, mantendo os handlers enxutos e fáceis de testar.
