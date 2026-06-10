# API Handlers & Endpoints Directory

Este diretório contém os manipuladores de rotas de API (Event Handlers) do back-end do Nuxt.

## Estrutura do Diretório
- **auth/**: Rotas internas gerenciadas pelo Better Auth. Não mova para `v1`.
- **v1/**: Rotas de API da aplicação versionadas.
  - [status.get.ts](server/api/v1/status.get.ts): status operacional do app e do PostgreSQL.
  - **users/**: Endpoints de usuário autenticado.
- **telemetry/**: Endpoints técnicos de telemetria. O endpoint atual é opcional e recebe métricas de performance validadas.

## Padrão para Criação de Endpoints

Para garantir consistência e segurança, todo endpoint deve seguir a estrutura abaixo:

### 1. Versionamento e Caminho de Arquivos
- Crie novos endpoints organizados por domínio sob `server/api/v1/<recurso>/[action].ts` ou `server/api/v1/<recurso>.ts`.
- Respeite o prefixo `/api/v1` para APIs de aplicação, incluindo endpoints operacionais como `/api/v1/status`.
- Exceções permitidas: rotas internas do Better Auth em `server/api/auth/` e endpoints técnicos explicitamente documentados, como telemetria.

### 2. Validação Obrigatória com Zod
- Sempre valide o corpo da requisição (`readBody`) ou parâmetros de busca (`getQuery`) utilizando esquemas Zod compartilhados em `shared/validation/`.
- Retorne erro de validação HTTP 400 se os dados forem inválidos.

### 3. Autenticação
- Use `auth.api.getSession({ headers: toWebRequest(event).headers })` para endpoints que exigem sessão.
- Retorne HTTP 401 com `createError({ statusCode: 401, message: '...' })` quando não houver sessão.
- Não confie em IDs enviados pelo cliente para identificar o usuário autenticado; use `session.user.id`.
- Use `assertRateLimit` em endpoints sensíveis ou expostos publicamente.

### 4. Delegação de Lógica para Services
- O Handler de API deve atuar estritamente como um controlador.
- **Não escreva consultas SQL diretas no handler**. Instancie a classe de serviço responsável e invoque seus métodos.
- Exceção: endpoints operacionais de status/health podem consultar `pool` diretamente para medir dependências de infraestrutura.
- O status endpoint deve respeitar `STATUS_EXPOSE_DETAILS`; detalhes de banco não devem ser expostos por padrão.

### 5. Tratamento de Erros
- Utilize `createError` do H3 para retornar códigos HTTP e mensagens semânticas.
- Prefira a propriedade `message`, não `statusMessage`.

### Exemplo de Estrutura de Endpoint
```typescript
import { updateProfileSchema } from '~/shared/validation/auth'
import { userService } from '~/server/services/user'
import { auth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: toWebRequest(event).headers
  })

  if (!session) {
    throw createError({ statusCode: 401, message: 'Autenticação necessária' })
  }

  const body = await readBody(event)
  const result = updateProfileSchema.safeParse(body)
  
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Dados de entrada inválidos',
      data: result.error.format()
    })
  }

  const updatedUser = await userService.updateProfile(session.user.id, result.data)

  return { success: true, user: updatedUser }
})
```
