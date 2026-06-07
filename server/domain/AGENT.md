# Domain Layer (Nucleus)

Este diretório contém o núcleo do sistema (Nucleus), totalmente independente de frameworks, bibliotecas de validação externa (Zod) ou ferramentas de persistência (Drizzle).

## Estrutura do Diretório
- **user/**: Lógica de domínio do recurso de usuário:
  - [entity.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/server/domain/user/entity.ts): Modelo puro de entidade `UserDomain` e funções auxiliares de validação de domínio.
  - [repository.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/server/domain/user/repository.ts): Interface (port) definindo operações de persistência necessárias para a lógica do domínio.

## Padrões Recomendados
- **Pureza Estrita**: Código nesta camada não deve fazer importações de banco de dados (`server/database/client`), Drizzle ORM, Zod ou Nitro. Ele deve ser composto apenas de tipos puros de TypeScript e lógica algorítmica/regras de validação de negócio.
- **Interfaces como Portas**: Sempre defina a assinatura das operações de banco de dados por meio de interfaces de repositório nesta camada. Isso permite que a lógica de negócios dependa de abstrações, facilitando a substituição da persistência e a escrita de testes unitários rápidos usando mocks (stubs) na camada de serviço.
