# Vue Components Directory

Este diretório contém os componentes reutilizáveis da interface visual.

## Estrutura do Diretório
- **dashboard/**: Componentes exclusivos da visualização do dashboard.
  - [StatusPanel.vue](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/components/dashboard/StatusPanel.vue): Painel reativo para demonstração de recebimento de Props.
  - [ActionPanel.vue](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/components/dashboard/ActionPanel.vue): Painel interativo para demonstração de emissão de eventos (Emits).

## Padrões Recomendados
- **Props e Emits Fortes**: Sempre declare as propriedades e eventos usando interfaces TypeScript e macros nativas do Vue (`defineProps` e `defineEmits`).
- **Organização**:
  - Componentes de uso geral do sistema (ex: inputs customizados, botões específicos, cards genéricos) devem ser criados sob uma pasta `common/`.
  - Componentes específicos de uma funcionalidade devem ser organizados em pastas nomeadas de acordo (ex: `auth/`, `dashboard/`).
