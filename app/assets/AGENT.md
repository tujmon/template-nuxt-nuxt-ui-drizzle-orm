# Assets Directory

Este diretório contém assets estáticos e estilos globais usados pelo Nuxt.

## Estrutura Atual
- [css/main.css](app/assets/css/main.css): CSS global registrado em `nuxt.config.ts`.
- [app.config.ts](../app.config.ts): configuração global do Nuxt UI para cores semânticas, ícones e defaults de componentes.
- [themes/](../themes): presets de tema do Nuxt UI selecionáveis por `NUXT_UI_THEME`.

## Padrões Recomendados
- Use este diretório para estilos globais, fontes e assets que precisam passar pelo pipeline do Vite/Nuxt.
- Em Nuxt UI 4, `main.css` deve importar `tailwindcss` e `@nuxt/ui`; sem esses imports as classes utilitárias renderizam sem estilo.
- Centralize tema do Nuxt UI em `app/themes/`; use `app/app.config.ts` apenas para selecionar/aplicar o preset ativo.
- Use `main.css` apenas para imports, fontes, `@theme` do Tailwind e tokens CSS globais que não sejam cobertos por `defineAppConfig`. Cores customizadas precisam declarar as 11 shades no `@theme` antes de serem usadas em um preset.
- Evite colocar regras específicas de componente em CSS global; prefira classes utilitárias ou estilos `scoped` no componente.
- Mantenha CSS global pequeno e voltado a tokens, reset leve ou integrações que precisam afetar toda a aplicação.
