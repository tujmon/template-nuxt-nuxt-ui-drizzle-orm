# Vue Components Directory

Este diretório contém os componentes reutilizáveis da interface visual.

## Estrutura do Diretório
- **dashboard/**: Componentes exclusivos da visualização do dashboard.
  - [StatusPanel.vue](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/app/components/dashboard/StatusPanel.vue): Painel reativo para demonstração de recebimento de Props.
  - [ActionPanel.vue](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/app/components/dashboard/ActionPanel.vue): Painel interativo para demonstração de emissão de eventos (Emits).
- **admin/**: Componentes exclusivos do painel admin.
  - [CreateUserModal.vue](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/app/components/admin/CreateUserModal.vue): Modal de criação de usuários via Better Auth Admin.
  - [BanUserModal.vue](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/app/components/admin/BanUserModal.vue): Modal de confirmação para banimento de usuários.

## Padrões Recomendados
- **Props e Emits Fortes**: Sempre declare as propriedades e eventos usando interfaces TypeScript e macros nativas do Vue (`defineProps` e `defineEmits`).
- **Nuxt UI 4**: Use componentes e props atuais (`UFormField`, `UDropdownMenu`, `USelect :items`). `UModal` deve receber conteúdo por slots nomeados, normalmente `#content`; o slot default é tratado como trigger.
- **Padrão de UI**: Siga [docs/ui-standards.md](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/docs/ui-standards.md) para ações, botões, modais, feedback e alinhamentos.
- **Organização**:
  - Componentes de uso geral do sistema (ex: inputs customizados, botões específicos, cards genéricos) devem ser criados sob uma pasta `common/`.
  - Componentes específicos de uma funcionalidade devem ser organizados em pastas nomeadas de acordo (ex: `auth/`, `dashboard/`).

## Padrões de Estilo & Layout

Para manter o template flexível e customizável:

### 1. Uso do Nuxt UI e Tailwind CSS
- Prefira a utilização dos componentes do **Nuxt UI** (ex: `<UButton>`, `<UInput>`). Eles possuem suporte integrado para customização dinâmica de temas.
- Utilize as classes utilitárias do **Tailwind CSS** para estruturas de layout (grid, flexbox, espaçamento). Evite estilos embutidos em tags `<style>` para manter a facilidade de customização do tema global.

### 2. Customização do Tema & Variáveis Globais
- **Variáveis CSS Globais**: Caso precise registrar estilos ou propriedades customizadas que afetem toda a aplicação (ex: fontes customizadas, hacks globais ou variáveis de CSS variables), coloque-as no arquivo central [main.css](file:///Users/arthur/Documents/template-nuxt-nuxt-ui-drizzle-orm/app/assets/css/main.css), que está configurado globalmente no `nuxt.config.ts`.
- **Cores Semânticas**: Ao construir componentes, utilize cores semânticas padrão do Nuxt UI (ex: `color="primary"` ou `color="gray"`) em vez de cores estáticas específicas como `emerald` ou `slate`. Isso garante que as cores dos botões e painéis mudem automaticamente quando o tema do projeto for alterado.
- **Configurando o Tema**: Caso o projeto passe a precisar de customização global, crie `app.config.ts` para opções do Nuxt UI ou um arquivo de configuração Tailwind apropriado. Não assuma que esses arquivos já existem.

### 3. Adaptação a Temas Claros/Escuros & Escopo
- Escreva componentes preparados para alternar entre Dark Mode e Light Mode utilizando os prefixos do Tailwind (ex: `bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50`).
- Mantenha as bordas e fundos flexíveis usando classes neutras (ex: `border-gray-200 dark:border-gray-800`).
- **CSS Scoped**: Se for estritamente necessário criar uma tag `<style>` dentro de um componente Vue, **ela deve obrigatoriamente possuir a propriedade `scoped`** (ex: `<style scoped>`). Isso previne vazamentos de estilos para outros elementos e garante encapsulamento.
