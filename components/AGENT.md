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

## Padrões de Estilo & Layout

Para manter a consistência estética e premium do template:

### 1. Uso do Nuxt UI e Tailwind CSS
- Prefira a utilização dos componentes built-in do **Nuxt UI** (ex: `<UButton>`, `<UInput>`, `<UCard>`, `<UModal>`). Eles já possuem integrações nativas de acessibilidade, transições e classes utilitárias de cores configuradas.
- Utilize classes utilitárias do **Tailwind CSS** para customizações de grid, flexbox, espaçamento, tipografia e bordas. Evite estilos ad-hoc em tags `<style>` ou CSS puro.

### 2. Paleta de Cores e Temas
- **Tema Escuro (Dark Mode)**: O template utiliza fundo escuro padrão (`bg-slate-950` ou `bg-slate-900/50`) e textos contrastantes em tons claros (`text-slate-100` e `text-slate-400`). Ao criar componentes, use variações semânticas de cinzas para divisões e borders (`border-slate-800`).
- **Cores de Destaque**: O padrão utiliza `emerald`, `teal` e `indigo` para gradientes de títulos (`from-emerald-400 to-indigo-500`) e botões primários. Evite introduzir novas cores chamativas sem necessidade.

### 3. Glassmorphism e Efeitos Modernos
- Para modais, popups ou cards flutuantes, utilize o efeito de vidro fosco: `bg-slate-900/60 backdrop-blur-md border border-slate-800` para garantir aspecto premium.

