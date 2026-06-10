# Business Logic Services Directory

Este diretório contém toda a lógica de negócios e manipulações complexas de dados do servidor do template.

## Estrutura do Diretório
- [base.ts](server/services/base.ts): Classe base de serviço injetando o cliente `db` do Drizzle.
- [user.ts](server/services/user.ts): Serviço específico para lógica e consultas de usuários.

## Padrões Recomendados
- Toda a lógica de leitura, escrita e regras de negócio complexas deve residir em classes de serviço.
- As rotas de API da pasta `server/api/` devem apenas validar os parâmetros de entrada e chamar o respectivo serviço, mantendo os handlers enxutos e fáceis de testar.
- Serviços não devem importar schemas do Drizzle ORM ou executar queries SQL diretamente. Toda persistência deve ser abstraída através de interfaces de repositório (ports) localizadas na camada de Domínio (`server/domain/`).
- Serviços devem ser desacoplados de bibliotecas externas de validação de borda (como Zod). A validação HTTP/Zod deve ocorrer nas rotas de API (controladores), passando DTOs simples ou tipos de domínio para os métodos de serviço.
- Serviços com dependências estáticas/globais compartilhadas devem preferencialmente exportar uma instância singleton (ex: `export const userService = new UserService()`) para evitar recriação de instâncias em cada requisição. Mantenha a exportação da classe para permitir instâncias limpas em testes unitários.
