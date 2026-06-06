# API Handlers & Endpoints Directory

Este diretório contém os manipuladores de rotas de API (Event Handlers) do back-end do Nuxt.

## Estrutura do Diretório
- **auth/**: Rotas internas gerenciadas pelo Better-Auth.
- **v1/**: Rotas de API da aplicação versionadas.

## Padrão para Criação de Endpoints

Para garantir consistência e segurança, todo endpoint deve seguir a estrutura abaixo:

### 1. Versionamento e Caminho de Arquivos
- Crie novos endpoints organizados por domínio sob `server/api/v1/<recurso>/[action].ts` ou `server/api/v1/<recurso>.ts`.

### 2. Validação Obrigatória com Zod
- Sempre valide o corpo da requisição (`readBody`) ou parâmetros de busca (`getQuery`) utilizando esquemas Zod compartilhados em `shared/validation/`.
- Retorne erro de validação HTTP 400 se os dados forem inválidos.

### 3. Delegação de Lógica para Services
- O Handler de API deve atuar estritamente como um controlador.
- **Não escreva consultas SQL diretas no handler**. Instancie a classe de serviço responsável e invoque seus métodos.

### 4. Tratamento de Erros
- Utilize o helper `createError` do H3 para retornar códigos HTTP e mensagens semânticas em caso de erro.

### Exemplo de Estrutura de Endpoint
```typescript
import { registerSchema } from '~/shared/validation/auth'
import { UserService } from '~/server/services/user'

export default defineEventHandler(async (event) => {
  // 1. Validar Método
  assertMethod(event, ['POST'])

  // 2. Validar Payload com Zod
  const body = await readBody(event)
  const result = registerSchema.safeParse(body)
  
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dados de entrada inválidos',
      data: result.error.format()
    })
  }

  // 3. Invocar Serviço
  const userService = new UserService()
  try {
    const newUser = await userService.create(result.data)
    return { success: true, user: newUser }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Erro interno no servidor'
    })
  }
})
```
