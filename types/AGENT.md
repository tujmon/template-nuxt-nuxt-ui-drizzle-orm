# Types Directory

Este diretório contém augmentations TypeScript globais ou específicas de framework.

## Estrutura Atual
- [page-meta.d.ts](types/page-meta.d.ts): Expande `PageMeta` do Nuxt com a chave `auth`.

## Padrões Recomendados
- Use arquivos `.d.ts` apenas para augmentations globais ou de módulos.
- Sempre finalize arquivos de augmentation com `export {}` para garantir escopo de módulo.
- Ao adicionar novas chaves de `definePageMeta`, atualize este diretório e o [app/middleware/AGENT.md](app/middleware/AGENT.md).
