# UI Standards

Este documento define os padrões de interface, ações e fluxos do template. Use-o antes de criar telas, modais, formulários ou ações novas.

## Princípios

- A primeira tela de uma feature deve ser a experiência de uso, não uma explicação da feature.
- Ações devem aparecer perto do contexto que afetam.
- O usuário sempre deve saber: onde está, qual ação principal existe, o que mudou depois de clicar e como desfazer/sair quando aplicável.
- Prefira componentes Nuxt UI e classes Tailwind utilitárias. Não crie CSS global para comportamento específico de uma tela.
- O tema visual do Nuxt UI fica em `app/themes/`: cores semânticas, ícones padrão, variantes globais e overrides de slots compartilhados. `app/app.config.ts` apenas aplica o preset ativo.
- Use tokens semânticos (`text-default`, `text-muted`, `text-highlighted`, `bg-default`, `bg-elevated`, `border-muted`) em vez de palettes cruas (`slate`, `emerald`, `gray`, `zinc`) em novas telas.

## Temas

- Troque o tema de build com `NUXT_UI_THEME=default npm run dev`, `NUXT_UI_THEME=ocean npm run build` ou qualquer preset registrado em `app/themes/index.ts`.
- Valide os temas registrados com `npm run screenshots:themes`; as imagens ficam em `screenshots/themes/<tema>/`.
- Para criar um tema, copie um preset em `app/themes/presets/`, exporte-o em `app/themes/index.ts` e altere apenas tokens semânticos (`primary`, `secondary`, `neutral`, etc.) e overrides globais de componentes.
- Use palettes existentes do Tailwind quando possível. Para uma cor de marca própria, declare as 11 shades em `app/assets/css/main.css` usando `@theme static` e depois referencie o nome da cor no preset.
- Componentes e páginas não devem importar presets diretamente; eles consomem o tema por classes semânticas e props do Nuxt UI.

## Estrutura de Página

- Páginas operacionais usam largura máxima do layout padrão e conteúdo em blocos verticais com `space-y-6`.
- O topo da página deve ter:
  - título `h1`;
  - descrição curta quando ajuda a orientar;
  - ação primária à direita em desktop e abaixo do título em mobile, com largura de conteúdo (`w-auto shrink-0`).
- Não use cards dentro de cards. Use `UCard` para ferramentas, listas, tabelas, modais e itens repetidos.
- Em mobile, mantenha ações alinhadas à esquerda quando o layout vira coluna; não deixe botões esticarem por acidente.

## Botões

- Ação primária da tela: `color="success"` ou `color="primary"` com ícone quando houver ícone claro.
- Ação secundária: `color="neutral"` com `variant="subtle"` ou `variant="ghost"`.
- Ação destrutiva: `color="error"`, texto explícito e, quando houver impacto relevante, confirmação em modal.
- Ações de formulário ficam no rodapé do bloco/modal, alinhadas à direita em desktop:
  - `Cancelar` primeiro, `variant="ghost"` ou `variant="subtle"`;
  - ação principal por último, com cor semântica.
- Botões icônicos devem ter `aria-label`.
- Botões não devem preencher a largura total a menos que sejam o CTA principal de um formulário estreito, como login/cadastro.

## Formulários

- Use `UForm` + `UFormField` para formulários com schema.
- Inputs do mesmo grupo devem ter a mesma largura visual (`class="w-full"`).
- Ações auxiliares do input, como mostrar senha, devem ficar no slot `#trailing` do próprio `UInput`, não como botão externo que muda a largura da linha.
- Formulários de auth usam CTA `block` porque a tela é estreita e focada.
- Placeholders devem ser exemplos de formato, não instruções longas.
- Erros de formulário aparecem acima do formulário com `UAlert`.

## Tabelas E Listas

- Ações por linha ficam na última coluna, em `UDropdownMenu` alinhado ao fim.
- A primeira ação do menu deve ser a ação de fluxo comum; ações destrutivas ficam depois.
- Use badges para status e roles. Status ativos usam `success`; bloqueios/banimentos usam `error`.
- Filtros ficam no header do card da tabela. Contadores e metadados ficam à direita.

## Modais

- Use `UModal` com `#content`; o slot default é trigger no Nuxt UI 4.
- Modal deve ter título claro, corpo curto e ações no fim.
- Confirmações destrutivas devem citar o alvo da ação pelo nome ou e-mail.
- Fechar/cancelar não deve executar mutação.

## Feedback

- Use toast para resultado de mutações administrativas.
- Use `success` para operação concluída, `error` para falha, `warning` para bloqueios de validação ou campos obrigatórios.
- Depois de mutações em listas, recarregue os dados da lista.
- Fluxos que trocam sessão, como impersonation, devem mostrar estado persistente visível, não apenas toast.

## Auth E Admin

- Login e cadastro compartilham a mesma estrutura visual de auth.
- O painel admin deve sempre passar por `/admin` com `auth: 'protected'` e middleware `admin`.
- Permissões em controles de UI, como botões, CTAs, itens de menu, ações de tabela e dropdowns, devem ser usadas para esconder, mostrar ou desabilitar ações conforme a sessão atual, nunca como única barreira de segurança.
- Para controles que dependem de role, use `useAuthSession` e derive booleans nomeados no `<script setup>` como `const canManageUsers = computed(() => session.value?.user.role === 'admin')`.
- Ações sensíveis escondidas na UI ainda precisam ser protegidas no endpoint, service ou chamada Better Auth Admin correspondente.
- Quando o usuário não tem permissão para uma ação contextual, prefira remover a ação do menu. Se a ação precisa aparecer para explicar indisponibilidade, use estado desabilitado com texto curto e não dispare mutação.
- Impersonation deve:
  - ser iniciada pelo menu de ações do usuário alvo;
  - redirecionar para uma tela útil como `/dashboard`;
  - exibir banner global enquanto ativa;
  - oferecer `Voltar ao admin` para encerrar a sessão impersonada.

## Tokens Semânticos de Estilo

Ao criar ou editar telas e componentes, utilize as classes semânticas mapeadas nos temas e evite paletas cruas (como `slate`, `zinc`, etc.):
* **Textos:**
  * `text-default`: Cor de texto padrão para leitura principal.
  * `text-highlighted`: Alto contraste, para títulos principais (`h1`, `h2`) ou ênfases importantes.
  * `text-toned`: Cor intermediária, excelente para subtítulos ou itens ativos de navegação.
  * `text-muted`: Cor atenuada, para textos auxiliares ou descrições.
  * `text-dimmed`: Texto muito sutil, para legendas ou rótulos secundários.
* **Fundos (Backgrounds):**
  * `bg-default`: Cor de fundo da página.
  * `bg-elevated`: Cor de fundo para cards, modais e containers de conteúdo.
  * `bg-muted`: Fundo atenuado para banners temporários (ex: impersonation) ou alertas.
  * `bg-accented`: Fundo de destaque para painéis (ex: lado visual da tela de login).
* **Bordas:**
  * `border-muted`: Linhas de separação e bordas padrão.
  * `border-accented`: Linha de destaque para elementos de foco ou separações de painéis principais.

## Navegação Responsiva (Mobile)

* **Design Flexível:** Todas as telas operacionais devem adaptar-se para mobile. Grades flexíveis (`grid-cols-1 md:grid-cols-2`) devem ser preferidas.
* **Menu Mobile:** Elementos de navegação em desktop usam a classe `hidden md:flex`. No mobile, implemente um menu hambúrguer ou Drawer utilizando `<UDrawer>` do Nuxt UI v4 para não poluir a interface.
* **Componentes de Ação:** Ações contextuais de tabelas que usam `UDropdownMenu` continuam funcionando bem no mobile. Botões de ação em topo de tela devem quebrar para a linha de baixo, alinhados à esquerda ou ocupando `w-full` se for um CTA isolado.

## Tratamento de Erros e Feedback de UI

* **Estados de Carregamento:** Formulários e botões de ação que chamam serviços de API devem controlar o estado com `isLoading` e usar a propriedade `:loading` nos botões Nuxt UI correspondentes.
* **Feedbacks Claros:** Erros de validação e erros do servidor devem ser mapeados em português compreensível pelo usuário.
* **Exibição:** Utilize `<UAlert>` acima dos botões de ação do formulário para erros que impedem o envio total do formulário, ou mensagens de toast com `color="error"` caso o erro aconteça assincronamente fora do formulário ativo.

