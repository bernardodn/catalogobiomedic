# Catálogo sem distinção de produto/ativo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remover completamente a classificação produto/ativo, preservando os 18 itens, categorias, visibilidade, busca, CRUD e modo Supabase.

**Architecture:** O domínio passa a representar somente `CatalogItem`; demo e Supabase continuam atrás dos mesmos repositórios. A URL antiga com `type` é normalizada no hook de consulta, enquanto a migration remota remove a coluna somente depois de atualizar RPCs e triggers.

**Tech Stack:** Next.js 16, React 19, TypeScript, Zod, Vitest, Testing Library, Playwright, Supabase PostgreSQL/RLS.

## Global Constraints

- Todos os 18 cadastros e 13 categorias atuais devem permanecer.
- `active` significa apenas visibilidade pública; não é a antiga classificação.
- Não adicionar preços, comércio, páginas individuais ou novas dependências.
- Modo demo continua padrão e persistente no navegador.
- Supabase mantém RLS, Storage, Auth e caminhos de imagem existentes.
- Cada tarefa usa TDD: teste falhando, implementação mínima, testes passando e commit próprio.

### Task 1: Contratos e migração do banco demo

**Files:**
- Modify: `src/lib/domain/catalog.ts`
- Modify: `src/lib/domain/schemas.ts`
- Modify: `src/lib/data/demo/seed.ts`
- Modify: `src/lib/data/demo/database.ts`
- Test: `src/lib/data/demo/database.test.ts`, `src/lib/domain/schemas.test.ts`

**Interfaces:** `CatalogItem`/`CatalogItemInput` não possuem `type`; `CatalogQuery` não possui filtro de tipo; `CatalogStats` expõe `total`, `enabled` e os campos de categoria existentes.

- [ ] Escrever testes que rejeitam `type` no schema e migram um payload demo versão 1 removendo somente `type`, preservando IDs, imagem, categoria, keywords e `active`.
- [ ] Rodar `npm test -- src/lib/data/demo/database.test.ts src/lib/domain/schemas.test.ts` e confirmar falha pela ausência da migração.
- [ ] Incrementar a versão persistida do demo, aceitar versão anterior, remover `type` durante leitura e atualizar os 18 seeds sem esse campo.
- [ ] Rodar os mesmos testes e `npm run typecheck`.
- [ ] Commitar `feat: remove item type from demo domain`.

### Task 2: Busca pública e componentes sem tipo

**Files:**
- Modify: `src/lib/domain/search.ts`
- Modify: `src/features/catalog/use-catalog-query.ts`
- Modify: `src/components/catalog/catalog-filters.tsx`
- Modify: `src/components/catalog/catalog-card.tsx`
- Modify: `src/components/catalog/results-summary.tsx`
- Modify: `src/components/catalog/catalog-browser.test.tsx`, `src/components/catalog/catalog-card.test.tsx`, `src/features/catalog/use-catalog-query.test.tsx`

**Interfaces:** `CatalogQuery` usa apenas `q`, `categoryId`, `sort`, `cursor` e `limit`; setters públicos não expõem `setType`.

- [ ] Adicionar testes para URL antiga `?type=active`/`?type=product` ser lida como consulta normal e para filtros públicos renderizarem apenas categoria/ordenação.
- [ ] Rodar os testes de catálogo e confirmar falha por referências a `type`.
- [ ] Remover parse, estado, URL, botões, selos e rótulos de tipo; manter busca acentuada, categoria, ordenação, paginação, empty state e cards não comerciais.
- [ ] Atualizar títulos e descrições públicas para “itens do catálogo” quando o texto ainda disser “produtos e ativos”.
- [ ] Rodar `npm test -- src/components/catalog src/features/catalog/use-catalog-query.test.tsx` e `npm run lint`.
- [ ] Commitar `feat: present a unified public catalog`.

### Task 3: Painel, formulário e estatísticas sem tipo

**Files:**
- Modify: `src/components/forms/catalog-form.tsx`
- Modify: `src/components/admin/catalog-admin-content.tsx`
- Modify: `src/components/admin/dashboard-stats.tsx`
- Modify: `src/components/admin/recent-items.tsx`
- Modify: `src/features/catalog/use-catalog-admin.ts`
- Modify: `src/lib/data/demo/catalog-repository.ts`
- Modify: related component tests under `src/components/admin`, `src/components/forms`, `src/features/catalog`

**Interfaces:** Form values não possuem `type`; `CatalogStats` não calcula `actives`/`products`; tabela mostra item, categoria, visibilidade e ações.

- [ ] Escrever testes que confirmam ausência do campo Tipo, dos selos Ativo/Produto e das estatísticas separadas, além da criação/edição preservando `active`.
- [ ] Rodar testes administrativos e confirmar falha pelas referências atuais.
- [ ] Remover controles e colunas de tipo; recalcular dashboard como total, categorias e itens visíveis; manter CRUD, upload, exclusão confirmada e layout móvel empilhado.
- [ ] Ajustar seed/repositório demo e mensagens administrativas para “item” sem alterar a semântica de visibilidade.
- [ ] Rodar `npm test`, `npm run lint`, `npm run typecheck` e `npm run build`.
- [ ] Commitar `feat: simplify admin item management`.

### Task 4: Adaptador Supabase e migration remota

**Files:**
- Create: `supabase/migrations/20260816235000_remove_catalog_item_type.sql` usando `npx supabase migration new remove_catalog_item_type` e renomeando o arquivo gerado para este nome caso o relógio da CLI produza outro timestamp
- Modify: `supabase/seed.sql`
- Modify: `src/lib/data/supabase/mappers.ts`
- Modify: `src/lib/data/supabase/catalog-repository.ts`
- Modify: `src/lib/data/supabase/mappers.test.ts`, `src/lib/data/supabase/migration.test.ts`

**Interfaces:** RPC `search_catalog_items(p_query, p_category_id, p_sort, p_offset, p_limit, p_include_inactive)` não recebe `p_type`; mapeadores não aceitam `type`.

- [ ] Escrever testes de mapper sem `type` e garantias estáticas que a nova migration remove `p_type`, a coluna e o enum após atualizar a RPC.
- [ ] Rodar `npm test -- src/lib/data/supabase` e confirmar falha pelas interfaces antigas.
- [ ] Criar migration via CLI; substituir função RPC, atualizar normalização de busca sem tipo, remover índices de tipo e então executar `drop column type` e `drop type catalog_item_type`.
- [ ] Atualizar seed, mapper e repositório para o novo formato mantendo RLS, Storage e Auth.
- [ ] Rodar testes Supabase, `npm run typecheck` e `npx supabase db lint --local --level error` quando Docker estiver disponível; registrar a limitação se não estiver.
- [ ] Commitar `feat: remove catalog item type from Supabase`.

### Task 5: Verificação integrada e documentação

**Files:**
- Modify: `README.md`
- Modify: `docs/supabase-setup.md`
- Modify: `tests/e2e/public-catalog.spec.ts`
- Modify: `tests/e2e/admin-catalog.spec.ts`
- Modify: `tests/e2e/responsive.spec.ts`

**Interfaces:** Jornadas E2E validam catálogo único, criação/edição/visibilidade, restauração e ausência de texto produto/ativo.

- [ ] Atualizar testes E2E para não procurar filtros ou rótulos de tipo e adicionar uma asserção de que os 18 itens continuam carregando.
- [ ] Atualizar README e setup Supabase para dizer “itens”, incluindo migration adicional e comportamento de URLs antigas.
- [ ] Rodar `npm run lint`, `npm run typecheck`, `npm test`, `PLAYWRIGHT_USE_LOCAL_CHROME=1 npm run test:e2e` e `npm run build`.
- [ ] Revisar visualmente `/`, `/catalogo`, `/admin`, `/admin/catalogo`, formulário e categorias em 390px e desktop; confirmar ausência de overflow e erros de console.
- [ ] Commitar `test: verify unified catalog flows`.
