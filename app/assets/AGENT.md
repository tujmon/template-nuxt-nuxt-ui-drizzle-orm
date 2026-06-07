# Assets Directory

Este diretório contém assets estáticos e estilos globais usados pelo Nuxt.

## Estrutura Atual
- [css/main.css](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/app/assets/css/main.css): CSS global registrado em `nuxt.config.ts`.

## Padrões Recomendados
- Use este diretório para estilos globais, fontes e assets que precisam passar pelo pipeline do Vite/Nuxt.
- Em Nuxt UI 4, `main.css` deve importar `tailwindcss` e `@nuxt/ui`; sem esses imports as classes utilitárias renderizam sem estilo.
- Evite colocar regras específicas de componente em CSS global; prefira classes utilitárias ou estilos `scoped` no componente.
- Mantenha CSS global pequeno e voltado a tokens, reset leve ou integrações que precisam afetar toda a aplicação.
