# Project Invariants

Estas regras existem para evitar mudanças locais que quebram o desenho global do template.

## API

- Toda API de aplicação deve ficar em `server/api/v1`.
- Exceções sem `/v1` precisam estar documentadas. Hoje as exceções são `server/api/auth` e `server/api/telemetry`.
- Handlers de API devem agir como controladores: autenticar, validar, aplicar rate limit e delegar regra de negócio.
- Payload externo deve ser validado no servidor com Zod vindo de `shared/validation`.
- Handlers não devem acessar `server/database/client` diretamente, exceto endpoints operacionais como `GET /api/v1/status`.

## Auth E Rotas

- Toda página em `app/pages/` deve declarar `definePageMeta({ auth })`.
- Valores válidos de `auth`: `public`, `guest`, `protected`.
- O middleware global assume `protected` quando o meta é omitido, mas páginas novas ainda devem ser explícitas.
- Permissões em controles de UI, como botões, CTAs, itens de menu, ações de tabela e dropdowns, controlam apenas visibilidade ou estado visual. Toda ação sensível também deve ser autorizada no servidor, em API/service/admin client adequado.
- Controles que precisam reagir à sessão devem usar `useAuthSession`; não devem chamar `authClient.useSession(useFetch)` diretamente.

## Configuração

- Código de servidor deve usar `server/utils/env.ts` para variáveis de ambiente.
- Não leia `process.env` diretamente em handlers, services ou database client.
- Variáveis novas precisam aparecer em `.env.example` e `.env.test`.
- `.env.test` é versionado e deve continuar seguro para teste local.

## Banco E Seeds

- Seeds devem ser idempotentes, transacionais e bloqueados em produção por padrão.
- Scripts operacionais ficam em TypeScript e rodam via `tsx`.
- Dados obrigatórios ficam em `system.seed.ts`; dados fictícios ficam em `demo.seed.ts`.
- Usuários Better Auth devem usar `hashPassword` de `better-auth/crypto`.

## Qualidade

- Código runtime não deve usar `console`.
- Scripts CLI podem usar `console` com `/* eslint-disable no-console */` local.
- Rode `npm run agent:check` antes de finalizar mudanças.
- Use `npm run cdd:check` quando mexer em lógica, fluxo ou scripts.

## Estrutura e Nomenclatura de Arquivos

- **Componentes Vue:** Devem usar obrigatoriamente **PascalCase** em seus nomes de arquivo (ex: `CreateUserModal.vue`, `StatusPanel.vue`).
- **Composables e Utils:** Devem usar **camelCase** e seguir o padrão de prefixo `use` para composables (ex: `useAuthSession.ts`, `useAdminActions.ts`).
- **Rotas de API:** Devem usar a convenção de nomenclatura de arquivos do Nuxt (`server/api/v1/...`).

## Tratamento de Erros no Backend

- **Camada de Serviços:** Serviços não devem acoplar códigos HTTP. Eles devem lançar erros descritivos limpos (`throw new Error('Mensagem descritiva')`).
- **Controladores (Handlers):** O controlador deve capturar os erros em blocos `try/catch` e traduzi-los em respostas estruturadas usando a função `createError` do H3, definindo o `statusCode` adequado (ex: 400 para erros de validação de negócios, 404 para entidades não encontradas) e a mensagem formatada para o cliente.

## Internacionalização e Idioma

- A interface pública e o painel de administração devem ser mantidos estritamente em **Português (pt-BR)**.
- Mensagens de validação Zod, avisos de erro, toasts e descrições de tela não devem conter termos em inglês ou outros idiomas de forma arbitrária nas superfícies visíveis.

