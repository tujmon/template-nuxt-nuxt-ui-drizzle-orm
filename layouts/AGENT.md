# Layouts Directory

Este diretório contém layouts Nuxt reutilizados por páginas.

## Estrutura Atual
- [default.vue](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/layouts/default.vue): Layout principal com navegação, sessão e conteúdo autenticado/público.
- [auth.vue](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/layouts/auth.vue): Layout compacto para login e cadastro.

## Padrões Recomendados
- Layouts devem orquestrar estrutura visual ampla, não regras de negócio.
- Não duplique lógica de proteção de rota em layouts; use `definePageMeta({ auth })` e o middleware global.
- Mantenha chamadas de sessão em layout apenas quando a navegação precisa reagir ao usuário autenticado.
- Evite colocar cards dentro de cards; layouts devem ser superfícies amplas e estáveis.
