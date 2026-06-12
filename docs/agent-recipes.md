# Agent Recipes

Receitas rápidas para manter agentes de IA dentro dos padrões do template.

## Adicionar Endpoint

1. Crie a rota em `server/api/v1`.
2. Crie ou reutilize um schema em `shared/validation`.
3. Valide o body com `safeParse` ou `parse` no handler.
4. Aplique `assertRateLimit` quando o endpoint aceitar tráfego externo relevante.
5. Coloque regra de negócio em `server/services`.
6. Cubra status code, payload e validação em `tests/e2e`.

## Adicionar Página

1. Crie a página em `app/pages/`.
2. Declare `definePageMeta({ auth: 'public' | 'guest' | 'protected' })`.
3. Em páginas admin, adicione também `middleware: 'admin'`.
4. Use layouts e componentes existentes antes de criar novos padrões visuais.
5. Evite lógica de domínio dentro da página; extraia para composables ou services conforme o lado.
6. Siga `docs/ui-standards.md` e os padrões atuais do Nuxt UI 4: `UFormField`, `UTable :data`, `UDropdownMenu`, `USelect :items` e `UModal` com slots nomeados.

## Adicionar Variável De Ambiente

1. Adicione a variável em `server/utils/env.ts`.
2. Documente em `.env.example`.
3. Defina valor seguro em `.env.test`.
4. Use `env.NOME_DA_VARIAVEL` no runtime de servidor.

## Adicionar Seed

1. Escolha `system.seed.ts` para dados obrigatórios ou `demo.seed.ts` para dados fictícios.
2. Mantenha o seed idempotente.
3. Use transação via `runInTransaction`.
4. Não remova a guarda de produção.
5. Teste com `SEED_ENV_FILE=.env.test npm run db:seed`.

## Adicionar Schema Zod

1. Coloque schemas compartilhados em `shared/validation`.
2. Exporte o tipo com `z.infer`.
3. Use o mesmo schema no formulário e no endpoint quando o contrato for compartilhado.
4. Mensagens de erro devem ser úteis para o usuário ou consumidor da API.

## Escolher Skill De Criação

- Para server-side, use `.agents/skills/nuxt-server-creation/SKILL.md`.
- Para UI, use `.agents/skills/nuxt-ui-creation/SKILL.md`.
- Para uma feature full-stack, use as duas e valide o contrato entre formulário, endpoint e service.

## Antes De Finalizar e Entregar

1. **Rode a suite completa de testes e validações:**
   ```bash
   npm run agent:check
   ```
   *Atenção:* Você **nunca deve ignorar falhas** no console ou mentir em relatórios. Se qualquer teste falhar (`FAIL`), você deve investigar e corrigir antes de declarar sucesso.

2. **Escreva Asserções Fortes em Testes de Concorrência:**
   - Em testes de concorrência, não verifique apenas se o estado final é válido (ex: saldo >= 0).
   - Valide se o número exato de transações esperadas passou e falhou (ex: `expect(fulfilled.length).toBe(1)` se apenas uma ordem deveria executar).
   - Valide se a integridade dos dados finais corresponde exatamente às operações executadas:
     `expect(saldoInicial - (quantidadeDeSucessos * custoUnitario)).toBe(saldoFinal)`.

Se o banco local de teste não estiver ativo:

```bash
POSTGRES_PORT=5433 npm run db:up
```
