# Shared Validation Directory

Este diretório contém esquemas de validação baseados em **Zod** que são importados tanto pelo front-end quanto pelo back-end.

## Estrutura do Diretório
- [auth.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/shared/validation/auth.ts): Validações para formulários de login, registro e atualizações cadastrais.

## Padrões Recomendados
- Mantenha esquemas de validação aqui para garantir a consistência das restrições de tipos (ex: formato de e-mail, comprimento de senhas) no cliente e no servidor.
- Use esses esquemas no front-end junto com a propriedade `:schema` do componente `<UForm>` do Nuxt UI.
- Use esses esquemas no back-end para filtrar ou analisar os corpos de requisições de API (`readBody(event)`).
