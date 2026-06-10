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
* **Impacto:** Risco de inconsistência de dados (drift) se os cálculos de progresso forem executados de forma desnormalizada e sem transações seguras, ou consultas muito lentas se calculados em tempo real na leitura de tabelas gigantes. Para dados pesados de alta frequência e leitura constante, desnormalize-os no banco de dados. A atualização em cascata deve ser feita pelo Service correspondente envolta em um bloco de transação (`runInTransaction`) para garantir que todas as atualizações de progresso ocorram de forma atômica ou falhem juntas.

## 8. Clientes HTTP Externos e Resiliência
* **Lacuna:** O template não documenta um padrão para chamadas de APIs externas (como Liferay, modelos LLM, etc.), deixando o servidor vulnerável a gargalos por falhas de terceiros.
* **Impacto:** Latência alta no servidor e travamento de rotas caso APIs externas sofram com instabilidade ou lentidão.
* **Regra Proposta:** Toda requisição HTTP externa deve ser isolada em uma classe de serviço ou cliente dedicado. As requisições devem, obrigatoriamente:
  * Definir limites de timeout estritos (máximo de 15 segundos para chamadas de LLM, 5 segundos para integrações comuns).
  * Implementar políticas de retries (máximo 3 tentativas com recuo exponencial).
  * Tratar erros HTTP de forma limpa, nunca deixando exceções cruas vazarem para o controlador.

## 9. Armazenamento e Busca Vetorial (pgvector)
* **Lacuna:** Falta de convenção para uso de dados vetoriais, indexação HNSW e queries de busca semântica usando Drizzle ORM.
* **Impacto:** Consultas vetoriais lentas por falta de índices adequados, ou código complexo e inconsistente de buscas em raw SQL misturado à camada de infraestrutura.
* **Regra Proposta:** Toda coluna de embedding vetorial deve ser mapeada no banco utilizando a extensão `pgvector` oficial compatível com Drizzle. Índices de busca vetorial (HNSW com similaridade de cosseno) devem ser explicitamente criados nas migrations. A busca vetorial deve residir na camada de Repository e expor uma interface limpa que retorne entidades de Chunk de domínio.

## 10. Respostas Assíncronas por Streaming (Server-Sent Events)
* **Lacuna:** As diretrizes de APIs do template assumem retornos JSON estáticos. Não há padrão para endpoints de chat que retornam streams de texto em tempo real (token streaming).
* **Impacto:** Experiência de uso ruim no chat de IA (usuário precisa esperar todo o raciocínio agêntico terminar para ver a resposta).
* **Regra Proposta:** Endpoints de chat agêntico que exigem streaming de tokens devem utilizar o utilitário nativo de streaming do Nitro (ex: `sendStream` ou `event.node.res`) integrado a bibliotecas como o Vercel AI SDK. As mensagens enviadas pelo canal de stream devem seguir um envelope estruturado contendo estados do agente ("pensando", "chamando ferramenta X", "texto final").

## 11. Segurança de Ferramentas de Agente (Agent Tool Calling)
* **Lacuna:** Falta de regras de isolamento e segurança para ferramentas expostas a loops agênticos de LLMs.
* **Impacto:** Riscos de segurança graves (como Server-Side Request Forgery - SSRF ou injeção de comandos) caso o LLM manipule argumentos das ferramentas para acessar arquivos locais ou rotas internas restritas.
* **Regra Proposta:** Toda ferramenta exposta a um agente de IA deve possuir validação de argumentos via schema Zod rígido. Ferramentas que realizam busca externa (ex: web search ou requisições HTTP livres) devem passar por uma camada de sanitização e proibição de IPs de rede local (intranet e localhost).

## 12. Caso de Uso: AI-RAG & Agentic Chat (Liferay + Chronos-2 + Qwen)
* **Mapeamento de Fluxo:**
  * O usuário envia uma mensagem no chat do frontend.
  * O backend ativa um loop de agente (Qwen) que decide se precisa buscar informações (RAG no Liferay via similaridade vetorial com pgvector) ou invocar o Chronos-2 para análises de séries temporais/foresight.
  * As chamadas de ferramentas e o fluxo de pensamento ("thought chains") são transmitidos via Server-Sent Events (SSE) para o frontend.
* **Desafios Identificados:** Sincronização incremental e eficiente de documentos Liferay, latência em chamadas de inferência de LLM/Foresight, e renderização dinâmica de fluxos de pensamento complexos no frontend.

## 13. Caso de Uso: Sistema de Votação (Temas, Validação de E-mail, Auditoria e Envio de Status)
* **Mapeamento de Fluxo:**
  * O administrador cria temas de votação, definindo períodos de início e término.
  * O usuário vota informando seu e-mail, que exige validação através de token OTP de uso único.
  * O backend valida o token OTP, registra o voto de forma anônima para preservar a privacidade e atualiza os dashboards e agregados.
  * Serviços de notificação em segundo plano (background workers) enviam e-mails transacionais com a situação atual da votação para os inscritos.
  * Geração periódica e sob demanda de relatórios assinados digitalmente ou logs de auditoria imutáveis.
* **Desafios Identificados:**
  * **Anonimização vs. Prevenção de Fraude:** Registrar se um e-mail já votou sem associá-lo ao voto específico (segregação de tabelas).
  * **Concorrência:** Alta concorrência no momento do voto (mecanismo de lock otimista ou filas).
  * **Auditoria Imutável:** Registro de logs de auditoria estruturados que comprovem a integridade da votação sem violar o sigilo do voto.
  * **Processamento Assíncrono:** Envio de e-mails em massa sem bloquear o servidor principal (uso de filas de background jobs).

## 14. Caso de Uso: Página de Observatório (Gráficos Dinâmicos e Conteúdo Colaborativo)
* **Mapeamento de Fluxo:**
  * Usuários visualizam dashboards ricos com diferentes tipos de gráficos (barras, linhas, pizza, mapas de calor, dispersão).
  * Pesquisadores ou usuários autorizados submetem novos conjuntos de dados ou conteúdos (artigos, relatórios, tabelas).
  * O backend valida o formato dos dados enviados, armazena de forma estruturada e atualiza dinamicamente as estatísticas agregadas em cache.
  * O frontend atualiza os gráficos de forma reativa usando bibliotecas especializadas compatíveis com SSR (como Chart.js ou D3 com wrappers adequados).
* **Desafios Identificados:**
  * **Desempenho de Carga de Dados:** Gráficos com milhares de pontos podem sobrecarregar o renderizador do navegador (exigindo amostragem de dados no backend).
  * **SSR (Server-Side Rendering) vs. Hidratação:** Gráficos dependem da API do canvas/DOM, gerando erros de hidratação no Nuxt se não encapsulados com `<ClientOnly>`.
  * **Modelagem Flexível de Dados:** Aceitar contribuições em diferentes formatos (JSON, CSV) e mapear esquemas dinâmicos no banco.
  * **Moderação de Conteúdo:** Workflow de aprovação de novos conteúdos antes de irem a público no observatório.

## 15. Caso de Uso: Gestão Hospitalar Crítica (Dados Sensíveis, Tolerância Zero a Falhas e RBAC/ABAC Rigoroso)
* **Mapeamento de Fluxo:**
  * Médicos, enfermeiros e pessoal administrativo acessam o sistema sob controle estrito de RBAC (Role-Based Access Control) e ABAC (Attribute-Based Access Control - ex: apenas a equipe da ala onde o paciente está internado pode ver seu prontuário).
  * Criação, edição e visualização de prontuários eletrônicos, receitas de medicamentos controlados e laudos de exames.
  * Registro e auditoria em tempo real de cada leitura ou alteração de registros de saúde (exigência da LGPD/HIPAA).
  * Sincronização offline e redundância ativa de serviços críticos para tolerância zero a indisponibilidade.
* **Desafios Identificados:**
  * **Segurança e Privacidade de Dados Sensíveis:** Criptografia em repouso (at rest) de dados de identificação pessoal e prontuários (usando chaves criptográficas gerenciadas).
  * **Controle de Acesso Fino (ABAC):** Políticas de acesso complexas dinâmicas que dependem do contexto (turno do médico, ala de internação do paciente, emergência).
  * **Auditoria de Acesso Inviolável:** logs completos de leituras e escritas contendo ID do usuário, carimbo de data/hora, IP, recurso acessado e ação efetuada, impossíveis de serem apagados ou modificados (tabela apenas de inserção sem rota DELETE/UPDATE).
  * **Tolerância a Falhas e Alta Disponibilidade:** Garantia de funcionamento do sistema mesmo em quedas de rede (estratégias offline-first ou réplicas de leitura locais nos terminais das enfermarias).

## 16. Caso de Uso: Coleta e Auditoria de Pesquisas de IA (Integração OpenAlex e Metadados de Execução)
* **Mapeamento de Fluxo:**
  * O usuário (pesquisador) inicia uma busca bibliográfica automatizada por artigos de IA no OpenAlex (repositório global de metadados científicos).
  * O backend realiza requisições para a API do OpenAlex, processa os registros de obras, autores e citações recebidos, e salva de forma estruturada.
  * O sistema captura e anexa metadados detalhados de *como* a IA executou a pesquisa (ex: prompt original utilizado no agente de pesquisa, parâmetros de temperatura, tokens consumidos, cadeia de pensamento estruturada e passos de busca intermediários).
  * Pesquisadores extraem relatórios agregados e exportam dados brutos formatados (JSON/BibTeX) para fundamentação de novos artigos acadêmicos.
* **Desafios Identificados:**
  * **Resiliência e Rate-Limiting da API:** A API do OpenAlex exige headers amigáveis (politica de "polite pool" via e-mail no User-Agent) e possui limites estritos de requisições por segundo que precisam ser respeitados para evitar bloqueios.
  * **Rastreabilidade e Linhagem dos Dados (Data Provenance):** Garantir que o link entre a pesquisa final gerada, as fontes brutas retornadas do OpenAlex e os metadados do processo de inferência da IA fiquem indissociáveis no banco de dados.
  * **Normalização de Esquemas Acadêmicos Complexos:** Lidar com a estrutura rica do OpenAlex (conceitos hierárquicos, instituições e identificadores únicos como DOIs e ORCIDs) usando Drizzle ORM de forma performática.
  * **Exportação Dinâmica e Conversão de Formatos:** Suporte a conversões rápidas de esquemas de dados relacionais em formatos de referências bibliográficas (como BibTeX ou RIS).




