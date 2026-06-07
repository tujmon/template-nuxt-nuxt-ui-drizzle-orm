# Infrastructure Layer (Adapters)

Este diretório contém as implementações de infraestrutura e acesso a dados externos da aplicação (Adapters).

## Estrutura do Diretório
- **repositories/**: Implementações concretas das interfaces de repositório definidas na camada de Domínio:
  - [user.repository.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/server/infrastructure/repositories/user.repository.ts): Implementação de `UserRepository` (`DrizzleUserRepository`) usando queries Drizzle ORM.

## Padrões Recomendados
- **Isolamento de ORM**: Toda e qualquer operação que use Drizzle (`db`, `eq`, schemas de tabelas) deve ser enclausurada nesta camada. Não deixe que o cliente de banco de dados ou schemas do Drizzle vazem para os serviços (`server/services/`) ou rotas de API.
- **Mapeamento de Dados**: Os repositórios de infraestrutura devem receber parâmetros baseados nos tipos de domínio, executar queries específicas da base de dados e retornar entidades mapeadas de volta para o formato de domínio (`UserDomain`).
- **Exportação de Singleton**: Exporte uma instância singleton do repositório (ex: `export const drizzleUserRepository = new DrizzleUserRepository()`) para consumo nos serviços padrão, mas mantenha a exportação da classe limpa para isolamento nos testes se necessário.
