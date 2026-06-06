# Composables Directory

Este diretório contém composables reutilizáveis da aplicação.

## Estrutura Atual
- [performance-measure.ts](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/composables/performance-measure.ts): Mede ações no cliente usando User Timing API e pode reportar métricas ao endpoint de telemetria.

## Padrões Recomendados
- Composables devem ser pequenos, tipados e livres de efeitos globais inesperados.
- Não escreva logs de console em composables de app. Retorne dados ou aceite callbacks/opções para que o chamador decida como reagir.
- Para APIs de browser, proteja o acesso com `import.meta.client`.
- Para medição de performance, use `usePerformanceMeasure`; ele retorna a medida e só reporta ao servidor quando `report: true`.
