---
name: nuxt-server-creation
description: Creates server-side features in this Nuxt template using Nitro APIs, Zod validation, services, domain ports, Drizzle repositories, migrations, seeds, and tests. Use when adding or changing API endpoints, server services, database schemas, repositories, auth/admin behavior, env vars, seeds, or backend tests.
---

# Nuxt Server Creation

Use this skill for backend work in this template.

## Read first

1. `AGENT.md`
2. `docs/invariants.md`
3. `docs/agent-recipes.md`
4. The nearest `AGENT.md` in each directory you touch.

## Reuse before creating

Before creating a new server pattern, search for an existing one:

- Use `rg` to find similar endpoints, schemas, services, domain ports, repositories, migrations, seeds, and tests.
- Prefer extending the closest existing pattern over introducing a new abstraction.
- Do not create parallel naming, folder, validation, service, repository, migration, or test conventions.
- If a new pattern is necessary, document why in the nearest `AGENT.md` or in `docs/invariants.md` when it becomes a project rule.

## Feature workflow

1. Put application APIs under `server/api/v1`, except Better Auth routes and documented technical endpoints.
2. Define or reuse Zod contracts in `shared/validation`.
3. Keep API handlers thin: auth, rate limit, input parsing, service call, response shape.
4. Put business rules in `server/services`.
5. Keep domain types and repository ports in `server/domain`.
6. Implement persistence in `server/infrastructure/repositories` with Drizzle.
7. Add tables in `server/database/schema`, export them from `server/database/schema/index.ts`, then generate migrations.
8. Add tests at the lowest useful level: unit for pure logic, integration for services/repositories, e2e for API behavior.

## API checklist

- Use `readBody`, `getQuery`, or route params only at the handler boundary.
- Validate inputs with shared Zod schemas and return HTTP 400 with formatted validation errors.
- Use `auth.api.getSession({ headers: toWebRequest(event).headers })` for authenticated endpoints.
- Never trust a user id from the client when the action targets the current user; use `session.user.id`.
- Use `assertRateLimit` on public or sensitive endpoints.
- Throw `createError({ statusCode, message })`; prefer `message` over `statusMessage`.
- Do not import Drizzle schema or `db` directly in normal API handlers.

## Database checklist

- Do not create parallel database clients.
- Keep Better Auth schema fields compatible with the enabled plugins, including admin fields and `session.impersonatedBy`.
- After schema changes, run `npm run db:generate` and inspect the generated migration.
- For seed data, keep scripts idempotent and preserve the production guard.

## Validation

Run the narrow relevant tests first, then finish with:

```bash
npm run agent:check
```

If the test database is unavailable:

```bash
POSTGRES_PORT=5433 npm run db:up
```
