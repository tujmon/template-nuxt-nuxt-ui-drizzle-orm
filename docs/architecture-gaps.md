# Lacunas Arquiteturais e de Consistência Mapeadas

Este documento registra as lacunas identificadas no template e as regras propostas para garantir a consistência máxima do código gerado por diferentes IAs em cenários mais complexos.

---

## 1. Customização e Configuração de Tipografia
* **Lacuna:** Fontes como `Inter` estão injetadas de forma estática via tag `<link>` no head do `nuxt.config.ts`. Não há diretrizes sobre como adicionar ou trocar fontes de forma padronizada.
* **Impacto:** Diferentes IAs podem tentar injetar fontes de maneiras inconsistentes (algumas usando `@import` no CSS, outras no `nuxt.config.ts`, etc.).
* **Regra Proposta:** A alteração ou inclusão de fontes deve ser feita utilizando o módulo `@nuxt/fonts` ou centralizada na configuração do Nuxt UI no preset de temas. Evitar injeções estáticas de `<link>` no head global.

## 2. Integridade Referencial e Deleção no Banco de Dados
* **Lacuna:** O banco de dados dispara erros de restrição de chave estrangeira (FK) se não houver um comportamento explícito de deleção configurado, como visto nos testes de tarefas e usuários.
* **Impacto:** Erros de banco inesperados na camada de serviços e API ao tentar excluir dados que possuem relacionamentos.
* **Regra Proposta:** Toda chave estrangeira (FK) em novas tabelas deve declarar explicitamente o comportamento `onDelete`. Usar `onDelete: 'cascade'` para entidades dependentes de ciclo de vida (ex: comentários de tarefas) e `onDelete: 'set null'` para logs ou histórico.

## 3. Renderização Recursiva na UI
* **Lacuna:** Estruturas de dados em árvore (como threads de comentários aninhados) exigem componentes recursivos, os quais podem gerar loops infinitos de renderização ou vazamento de memória se não houver salvaguardas.
* **Impacto:** Travamento do navegador do usuário por estouro da pilha de execução (Call Stack).
* **Regra Proposta:** Componentes recursivos devem conter uma propriedade `depth` de limite máximo e uma condição `v-if` rigorosa de parada para interromper o auto-aninhamento.

## 4. Atualizações Otimistas de Interface (Optimistic UI)
* **Lacuna:** Operações de alta frequência (Kanban drag-and-drop, likes, adicionar comentários rápidos) requerem feedback instantâneo na UI antes da conclusão da chamada da API, mas não há um padrão de estado reativo definido no cliente para gerenciar isso.
* **Impacto:** Experiência de uso lenta ou telas piscando (*flickering*) devido a re-fetchings constantes de dados.
* **Regra Proposta:** Lógicas de board ou feeds devem implementar alteração otimista no estado reativo do cliente e possuir um mecanismo explícito de reversão de estado (*rollback*) em caso de falhas da requisição no bloco `catch`.

## 5. Permissões de Acesso por Recurso (Resource-Level Permissions)
* **Lacuna:** O template possui validações focadas apenas em regras globais (ex: `user.role === 'admin'`). Faltam diretrizes para validar se um usuário tem permissões específicas de controle sobre uma entidade de banco em particular (ex: "apenas o Supervisor associado a este Projeto pode aprovar esta Solicitação de Mudança").
* **Impacto:** Furos de segurança na API se a IA validar apenas a autenticação global, ou lógicas de consulta complexas implementadas de forma inconsistente entre diferentes endpoints.
* **Regra Proposta:** Toda validação de permissão de recurso deve ser encapsulada em uma função do respectivo Service no backend (ex: `projetoService.assertUserRole(projectId, userId, ['supervisor'])`). Os handlers de API devem chamar essa validação no início do fluxo. No frontend, crie composables de contexto que carreguem as regras locais do projeto selecionado.

## 6. Máquina de Estados para Ciclos de Vida de Entidades
* **Lacuna:** Entidades com ciclos de vida complexos (ex: Status do Projeto de Rascunho -> Ativo -> Concluído) necessitam de fluxos e validações rígidos para transição.
* **Impacto:** Transições ilegítimas de estado se o desenvolvedor ou IA criar rotas que permitam alteração de colunas de status diretamente no banco sem validação de fluxo.
* **Regra Proposta:** Evite expor a alteração de status em rotas PATCH genéricas. Modificações de status de ciclo de vida devem ser feitas por endpoints operacionais dedicados (ex: `POST /api/v1/projects/[id]/transition` ou através de entidades de fluxo como `SolicitacaoMudanca`). A lógica de transições válidas deve residir estritamente no modelo do domínio (`server/domain/`) ou em uma classe controladora de estado dedicada.

## 7. Atualização de Dados Calculados/Agregados (Rollup Progress)
* **Lacuna:** Cálculos acumulados (ex: progresso de tarefas atualiza o progresso do produto, que por sua vez atualiza o progresso do projeto) exigem atualizações coordenadas.
* **Impacto:** Risco de inconsistência de dados (drift) se os cálculos de progresso forem executados de forma desnormalizada e sem transações seguras, ou consultas muito lentas se calculados em tempo real na leitura de tabelas gigantes.
* **Regra Proposta:**
  * Para dados leves de baixa frequência, calcule-os dinamicamente na query (camada de Repository).
  * Para dados pesados de alta frequência e leitura constante, desnormalize-os no banco de dados. A atualização em cascata deve ser feita pelo Service correspondente envolta em um bloco de transação (`runInTransaction`) para garantir que todas as atualizações de progresso ocorram de forma atômica ou falhem juntas.

