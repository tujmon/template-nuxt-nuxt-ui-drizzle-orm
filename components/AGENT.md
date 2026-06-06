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

Para manter o template flexível e customizável:

### 1. Uso do Nuxt UI e Tailwind CSS
- Prefira a utilização dos componentes do **Nuxt UI** (ex: `<UButton>`, `<UInput>`). Eles possuem suporte integrado para customização dinâmica de temas.
- Utilize as classes utilitárias do **Tailwind CSS** para estruturas de layout (grid, flexbox, espaçamento). Evite estilos embutidos em tags `<style>` para manter a facilidade de customização do tema global.

### 2. Customização do Tema (Sem Cores Fixas)
- **Cores Semânticas**: Ao construir componentes, utilize cores semânticas padrão do Nuxt UI (ex: `color="primary"` ou `color="gray"`) em vez de cores estáticas específicas como `emerald` ou `slate`. Isso garante que as cores dos botões e painéis mudem automaticamente quando o tema do projeto for alterado.
- **Configurando o Tema**: O desenvolvedor final pode redefinir o tema padrão do Nuxt UI alterando a propriedade `ui` no arquivo `app.config.ts` ou estendendo a paleta de cores no `tailwind.config.js` do projeto.

### 3. Adaptação a Temas Claros/Escuros
- Escreva componentes preparados para alternar entre Dark Mode e Light Mode utilizando os prefixos do Tailwind (ex: `bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50`).
- Mantenha as bordas e fundos flexíveis usando classes neutras (ex: `border-gray-200 dark:border-gray-800`).


