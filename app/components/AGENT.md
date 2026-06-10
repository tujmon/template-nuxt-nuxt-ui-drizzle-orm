# Vue Components Directory

Este diretório contém os componentes reutilizáveis da interface visual.

## Estrutura do Diretório
- **dashboard/**: Componentes exclusivos da visualização do dashboard.
  - [StatusPanel.vue](app/components/dashboard/StatusPanel.vue): Painel reativo para demonstração de recebimento de Props.
  - [ActionPanel.vue](app/components/dashboard/ActionPanel.vue): Painel interativo para demonstração de emissão de eventos (Emits).
- **admin/**: Componentes exclusivos do painel admin.
  - [CreateUserModal.vue](app/components/admin/CreateUserModal.vue): Modal de criação de usuários via Better Auth Admin.
  - [BanUserModal.vue](app/components/admin/BanUserModal.vue): Modal de confirmação para banimento de usuários.

## Padrões Recomendados
- **Props e Emits Fortes**: Sempre declare as propriedades e eventos usando interfaces TypeScript e macros nativas do Vue (`defineProps` e `defineEmits`).
- **Nuxt UI 4**: Use componentes e props atuais (`UFormField`, `UDropdownMenu`, `USelect :items`). `UModal` deve receber conteúdo por slots nomeados, normalmente `#content`; o slot default é tratado como trigger.
- **Padrão de UI**: Siga [docs/ui-standards.md](docs/ui-standards.md) para ações, botões, modais, feedback e alinhamentos.
- **Organização**:
  - Componentes de uso geral do sistema (ex: inputs customizados, botões específicos, cards genéricos) devem ser criados sob uma pasta `common/`.
  - Componentes específicos de uma funcionalidade devem ser organizados em pastas nomeadas de acordo (ex: `auth/`, `dashboard/`).

## Padrões de Estilo & Layout

Para manter o template flexível e customizável:

### 1. Uso do Nuxt UI e Tailwind CSS
- Prefira a utilização dos componentes do **Nuxt UI** (ex: `<UButton>`, `<UInput>`). Eles possuem suporte integrado para customização dinâmica de temas.
- Utilize as classes utilitárias do **Tailwind CSS** para estruturas de layout (grid, flexbox, espaçamento). Evite estilos embutidos em tags `<style>` para manter a facilidade de customização do tema global.

### 2. Customização do Tema & Variáveis Globais
- **Tema Nuxt UI**: Centralize paletas semânticas, ícones padrão, `defaultVariants` e overrides globais de componentes em [app/themes](../themes). O [app.config.ts](../app.config.ts) deve apenas selecionar/aplicar o preset ativo. Não duplique essas decisões em cada componente.
- **Variáveis CSS Globais**: Caso precise registrar tokens CSS customizados, fontes, `@theme` do Tailwind ou integrações globais, coloque-os em [main.css](../assets/css/main.css), que está configurado globalmente no `nuxt.config.ts`.
- **Cores Semânticas**: Ao construir componentes, utilize props semânticas do Nuxt UI (ex: `color="primary"`, `color="neutral"`, `color="error"`) e classes semânticas (`text-default`, `text-muted`, `text-highlighted`, `bg-elevated`, `border-muted`) em vez de palettes estáticas como `emerald`, `slate`, `gray` ou `zinc`.
- **Ícones**: Em novos componentes, use `i-lucide-*`, que é o padrão do template em `app.config.ts`.

### 3. Adaptação a Temas Claros/Escuros & Escopo
- Escreva componentes preparados para alternar entre Dark Mode e Light Mode usando tokens semânticos do Nuxt UI antes de recorrer a prefixos `dark:`.
- Mantenha as bordas, fundos e textos flexíveis usando `border-muted`, `bg-default`, `bg-elevated`, `text-muted`, `text-toned` e `text-highlighted`.
- **CSS Scoped**: Se for estritamente necessário criar uma tag `<style>` dentro de um componente Vue, **ela deve obrigatoriamente possuir a propriedade `scoped`** (ex: `<style scoped>`). Isso previne vazamentos de estilos para outros elementos e garante encapsulamento.
