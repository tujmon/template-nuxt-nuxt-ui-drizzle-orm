# Topologia e Execução de Serviços Externos

Este documento descreve onde e como os serviços externos necessários para o funcionamento do template (e dos sistemas baseados nele) rodam, tanto em ambiente de desenvolvimento quanto em produção.

---

## 1. Banco de Dados (PostgreSQL + pgvector)

O banco de dados relacional principal armazena o estado da aplicação, dados de autenticação e embeddings vetoriais.

### Desenvolvimento Local
* **Onde roda:** Em um container Docker local via Docker Compose.
* **Portas:**
  * Desenvolvimento (`.env`): Porta `5432` mapeada no host.
  * Testes de Integração (`.env.test`): Porta `5433` mapeada no host para isolamento completo.
* **Configuração:** Gerenciado via `docker-compose.yml` (`postgres:16-alpine`).
* **Comando:** `npm run db:up` para iniciar e `npm run db:down` para parar.

### Produção / Staging
* **Onde roda:** PostgreSQL gerenciado (ex: AWS RDS, Supabase, Neon, GCP Cloud SQL).
* **Requisito Crítico:** O banco de dados **precisa** ter a extensão `pgvector` instalada e habilitada para suportar buscas semânticas (RAG).
* **Conexão:** Definida estritamente via variável de ambiente `DATABASE_URL` criptografada no provedor de nuvem.

---

## 2. Autenticação e Sessões (Better Auth)

A autenticação é centralizada no Better Auth, que roda no lado do servidor (Nitro).

### Desenvolvimento Local e Produção
* **Onde roda:** Executado internamente dentro da mesma instância do servidor Nuxt, utilizando o adaptador oficial do Drizzle ORM para persistência no PostgreSQL local ou remoto.
* **Configuração:** Toda a lógica reside sob as rotas interceptadas em `/api/auth/*` e é exposta ao frontend por meio do composable `useAuthSession`.

---

## 3. Armazenamento de Arquivos / S3 (Object Storage)

Utilizado para armazenar assets estáticos complexos, PDFs de prontuários, relatórios científicos gerados ou anexos enviados por usuários.

### Desenvolvimento Local
* **Onde roda:** 
  1. Para desenvolvimento offline simples: Roda localmente salvando os arquivos na pasta temporária `.output/public` ou em um container local do **MinIO** rodando na porta `9000`.
  2. Mock local de Storage usando a API nativa do Nitro Storage.
* **Configuração:** Mapeado via variável `STORAGE_PROVIDER=local` ou `STORAGE_PROVIDER=s3`.

### Produção / Staging
* **Onde roda:** Provedor de Object Storage compatível com a API do S3 (ex: AWS S3, Cloudflare R2, Supabase Storage).
* **Configuração:** Chaves de acesso, bucket e região injetados via variáveis de ambiente (`S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`).

---

## 4. Cache e Filas de Mensageria (Redis)

Necessário para rate limit distribuído, cache de consultas pesadas e processamento de tarefas em segundo plano (background workers).

### Desenvolvimento Local
* **Onde roda:** Em memória (usando o drive `memory` do Nitro Storage) para simplificar o setup inicial sem dependências adicionais, ou configurado via container Docker do **Redis** na porta `6379`.
* **Configuração:** Controlado pela variável `REDIS_URL` no `.env`.

### Produção / Staging
* **Onde roda:** Instância Redis gerenciada (ex: AWS ElastiCache, Upstash Redis, Redis Cloud).
* **Casos de Uso:**
  * **Rate Limiting:** Cache distribuído para rate limit global de requisições sensíveis nas APIs.
  * **BullMQ:** Processamento assíncrono resiliente de e-mails em massa, processamento do OpenAlex ou atualizações de progresso complexas.

---

## 5. Serviços de E-mail (SMTP / Transacional)

Utilizado para envio de tokens OTP de validação de voto, alertas de consultas e relatórios.

### Desenvolvimento Local
* **Onde roda:** **Mailpit** rodando em container Docker (porta `1025` para SMTP e `8025` para visualização web dos e-mails).
* **Configuração:** Variáveis `SMTP_HOST=localhost` e `SMTP_PORT=1025`.

### Produção / Staging
* **Onde roda:** Provedor de e-mail transacional externo (ex: Resend, SendGrid, Amazon SES, Mailgun).
* **Configuração:** Conexão autenticada configurada via chaves de API ou credenciais SMTP nas variáveis de ambiente (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`).

---

## 6. APIs de Inteligência Artificial e LLMs

Integrações com provedores de inferência de modelos (Qwen, GPT, etc.) e ferramentas de IA.

### Desenvolvimento Local
* **Onde roda:** 
  1. Inferência local via **Ollama** rodando no host da máquina de desenvolvimento (geralmente porta `11434`).
  2. Chamadas diretas de desenvolvimento para APIs de nuvem externas utilizando chaves de teste.
* **Configuração:** Variáveis `AI_API_KEY` e `AI_API_BASE_URL` configuradas no `.env`.

### Produção / Staging
* **Onde roda:** APIs gerenciadas de nuvem (ex: OpenAI, Anthropic, Hugging Face, ou clusters próprios de inferência via vLLM).
* **Resiliência:** As conexões devem passar obrigatoriamente por políticas de retry e timeouts definidos centralizadamente sob `server/clients/` conforme as regras de invariants.
