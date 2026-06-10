---
name: nuxt-ui-creation
description: Creates user interfaces in this Nuxt template with Nuxt UI v4, app/pages, app/components, app/composables, semantic theme tokens, accessible actions, forms, modals, tables, toasts, and screenshots. Use when adding or changing pages, Vue components, layouts, client composables, visual states, themes, or UI workflows.
---

# Nuxt UI Creation

Use this skill for frontend and product UI work in this template.

## Read first

1. `AGENT.md`
2. `docs/ui-standards.md`
3. `nuxt-ui.md` only for the specific component API being used.
4. The nearest `AGENT.md` in `app/pages`, `app/components`, `app/composables`, `app/layouts`, `app/middleware`, or `app/assets`.

## Reuse before creating

Before creating a new UI pattern, search for an existing one:

- Use `rg` to find similar pages, components, composables, layouts, middleware, theme presets, form schemas, tables, modals, and tests.
- Prefer extending the closest existing screen, component, composable, or theme pattern over introducing a new abstraction.
- Do not create parallel naming, folder, layout, form, modal, table, action-menu, toast, or theme conventions.
- If a new pattern is necessary, document why in the nearest `AGENT.md` or in `docs/ui-standards.md` when it becomes a UI rule.

## Page workflow

1. Create pages under `app/pages`, not root `pages`.
2. Declare `definePageMeta({ auth: 'public' | 'guest' | 'protected' })`; admin pages also use `middleware: 'admin'`.
3. Set route SEO with `useSeoMeta`; private routes should include `robots: 'noindex, nofollow'`.
4. Keep pages as orchestration. Move repeated or complex UI into `app/components/<feature>`.
5. Put client-side reusable state and actions in `app/composables`.

## Nuxt UI v4 patterns

- Keep `app/app.vue` wrapped with `UApp`; toasts, tooltips, and programmatic overlays depend on it.
- Use current component APIs: `UFormField`, `UTable :data`, `UDropdownMenu`, `USelect :items`, and `UModal` with named slots such as `#content` and `#body`.
- Use `UForm` with shared Zod schemas for forms.
- Use `useToast` for mutation feedback.
- Put row actions in a final table column using `UDropdownMenu`.
- Use `i-lucide-*` icons for new actions and provide `aria-label` for icon-only buttons.

## Theme and layout rules

- Prefer semantic classes: `text-default`, `text-muted`, `text-highlighted`, `bg-default`, `bg-elevated`, `border-muted`.
- Prefer semantic Nuxt UI colors: `primary`, `secondary`, `success`, `info`, `warning`, `error`, `neutral`.
- Do not hardcode brand palettes in pages or components; centralize theme choices in `app/themes`.
- Avoid cards inside cards.
- Keep actions close to the data or flow they affect.
- Use scoped component CSS only when utilities and theme slots are not enough.

## Validation

For UI changes, run the smallest relevant checks, then:

```bash
npm run lint
npm run build
```

For visual/theme changes, also run:

```bash
npm run screenshots:themes
```

Finish broader changes with:

```bash
npm run agent:check
```
