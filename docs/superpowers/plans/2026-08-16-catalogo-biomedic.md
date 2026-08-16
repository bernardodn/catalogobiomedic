# Catálogo Digital BioMedic Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o catálogo público e o painel administrativo da BioMedic, totalmente funcionais em modo demonstração e preparados para trocar para Supabase por configuração.

**Architecture:** Next.js App Router organiza rotas públicas e administrativas. Componentes consomem contratos assíncronos de repositório; adaptadores locais persistem dados no navegador e adaptadores Supabase usam Auth, PostgreSQL e Storage. Regras de domínio, normalização, validação e consulta são compartilhadas entre ambos os modos.

**Tech Stack:** Next.js, React, TypeScript strict, Tailwind CSS, shadcn/ui, Zod, React Hook Form, Supabase JS/SSR, Vitest, Testing Library, Playwright e ESLint.

## Global Constraints

- A aplicação inicia com `NEXT_PUBLIC_DATA_MODE=demo` e funciona sem serviços externos.
- Cards públicos não são links e não contêm preço, compra, carrinho ou botão de detalhes.
- Busca ignora caixa e acentos e cobre nome, tipo, categoria, descrição e palavras-chave.
- Itens inativos nunca aparecem na consulta pública.
- Categorias vêm do repositório; nenhuma lista de categorias fica hardcoded na interface.
- Busca e filtros públicos permanecem na URL; ordenação padrão é nome A–Z; cada lote tem 24 itens.
- Registros demo persistem em `localStorage`; imagens demo otimizadas persistem em IndexedDB.
- Imagens aceitas: PNG, JPEG e WebP de até 5 MB; demo converte para WebP e limita a 1.600 × 1.600 px.
- Descrição curta tem no máximo 320 caracteres; cada item aceita até 20 palavras-chave de no máximo 40 caracteres.
- Supabase usa RLS; middleware e controles visuais não substituem autorização no banco.
- A identidade usa a logo fornecida e tokens derivados de azul-ciano, azul profundo e neutros.
- O conteúdo de pagamentos e bandeiras não entra no projeto.
- Antes da conclusão: `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e` e `npm run build` devem passar.

## File Structure

```text
public/
  brand/biomedic-logo.png
  brand/catalog-placeholder.svg
src/
  app/
    (public)/layout.tsx
    (public)/page.tsx
    (public)/catalogo/page.tsx
    admin/login/page.tsx
    admin/(protected)/layout.tsx
    admin/(protected)/page.tsx
    admin/(protected)/catalogo/page.tsx
    admin/(protected)/catalogo/novo/page.tsx
    admin/(protected)/catalogo/[id]/editar/page.tsx
    admin/(protected)/categorias/page.tsx
    error.tsx
    globals.css
    layout.tsx
    robots.ts
    sitemap.ts
  components/
    public/*
    catalog/*
    admin/*
    forms/*
    feedback/*
    ui/*
  features/
    catalog/use-catalog-query.ts
    catalog/use-catalog-admin.ts
    categories/use-categories-admin.ts
    auth/use-admin-session.ts
  lib/
    config/content.ts
    domain/catalog.ts
    domain/schemas.ts
    domain/search.ts
    domain/slug.ts
    data/contracts.ts
    data/provider.tsx
    data/demo/*
    data/supabase/*
  middleware.ts
supabase/
  migrations/202608160001_catalog.sql
  seed.sql
tests/e2e/*
```

---

### Task 1: Foundation, toolchain and design tokens

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`
- Create: `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/lib/config/env.ts`
- Create: `src/lib/config/env.test.ts`
- Create: `components.json`
- Copy: `/Users/bernardodn/Downloads/logobiomedic-1.png` → `public/brand/biomedic-logo.png`
- Create: `public/brand/catalog-placeholder.svg`
- Modify: `.gitignore`
- Create: `.env.example`

**Interfaces:**
- Produces: `DataMode = "demo" | "supabase"` and `resolveDataMode(value?: string): DataMode`.
- Produces: scripts `dev`, `build`, `lint`, `typecheck`, `test`, `test:watch`, `test:e2e`.

- [ ] **Step 1: Install the application and test dependencies**

Run:

```bash
npm init -y
npm install next@latest react@latest react-dom@latest @supabase/supabase-js @supabase/ssr zod react-hook-form @hookform/resolvers lucide-react sonner clsx tailwind-merge class-variance-authority
npm install -D typescript @types/node @types/react @types/react-dom tailwindcss @tailwindcss/postcss eslint eslint-config-next vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test
```

Expected: `package-lock.json` is created and `npm ls --depth=0` exits 0.

- [ ] **Step 2: Create scripts and strict configuration**

Set `package.json` scripts to:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test"
}
```

Set `tsconfig.json` to strict mode, `moduleResolution: "bundler"`, `jsx: "preserve"`, `noEmit: true`, alias `@/*` → `./src/*`, and include `.next/types/**/*.ts`.

- [ ] **Step 3: Write the failing environment test**

```ts
import { describe, expect, it } from "vitest";
import { resolveDataMode } from "./env";

describe("resolveDataMode", () => {
  it("defaults to demo", () => expect(resolveDataMode()).toBe("demo"));
  it("accepts supabase", () => expect(resolveDataMode("supabase")).toBe("supabase"));
  it("rejects unknown values", () => expect(() => resolveDataMode("other")).toThrow());
});
```

- [ ] **Step 4: Run the test and confirm failure**

Run: `npm test -- src/lib/config/env.test.ts`  
Expected: FAIL because `./env` does not exist.

- [ ] **Step 5: Implement environment selection**

```ts
export type DataMode = "demo" | "supabase";

export function resolveDataMode(value = process.env.NEXT_PUBLIC_DATA_MODE): DataMode {
  if (value === undefined || value === "" || value === "demo") return "demo";
  if (value === "supabase") return "supabase";
  throw new Error(`NEXT_PUBLIC_DATA_MODE inválido: ${value}`);
}
```

Create `.env.example` with `NEXT_PUBLIC_DATA_MODE=demo`, blank Supabase URL/key variables, and no real secrets.

- [ ] **Step 6: Configure the root layout and brand tokens**

Create `globals.css` with semantic CSS variables for `--brand-cyan`, `--brand-navy`, surfaces, borders, success, danger and focus. Set readable base styles, visible focus, `prefers-reduced-motion`, and responsive container utilities. Root metadata must use the approved title and description and set `lang="pt-BR"`.

Create `catalog-placeholder.svg` as a neutral laboratory-inspired illustration with the text `BioMedic`, no product photo and no commerce iconography.

- [ ] **Step 7: Install the required shadcn primitives**

Run:

```bash
npx shadcn@latest init -d
npx shadcn@latest add button input select badge card sheet dialog dropdown-menu table form textarea switch skeleton separator tooltip
```

Expected: primitives appear under `src/components/ui` and use the project CSS variables.
Reconcile any `globals.css` changes made by the CLI so the BioMedic semantic tokens from Step 6 remain the source of truth.

- [ ] **Step 8: Verify foundation and commit**

Run:

```bash
npm test -- src/lib/config/env.test.ts
npm run typecheck
npm run lint
```

Expected: all commands pass.

```bash
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs vitest.config.ts vitest.setup.ts playwright.config.ts components.json .env.example .gitignore public src/app src/lib/config src/components/ui
git commit -m "chore: scaffold BioMedic application"
```

---

### Task 2: Domain model, validation, search and seed

**Files:**
- Create: `src/lib/domain/catalog.ts`
- Create: `src/lib/domain/search.ts`, `src/lib/domain/search.test.ts`
- Create: `src/lib/domain/slug.ts`, `src/lib/domain/slug.test.ts`
- Create: `src/lib/domain/schemas.ts`, `src/lib/domain/schemas.test.ts`
- Create: `src/lib/data/demo/seed.ts`, `src/lib/data/demo/seed.test.ts`

**Interfaces:**
- Produces: `CatalogItem`, `Category`, `CatalogItemInput`, `CatalogQuery`, `CatalogPage`, `CatalogStats`, `CatalogItemType`, `CatalogSort`, `DEFAULT_QUERY`.
- Produces: `normalizeText`, `buildSearchDocument`, `matchesCatalogQuery`, `sortCatalogItems`, `slugify`.
- Produces: `catalogItemSchema`, `categorySchema`, `DEMO_ITEMS`, `DEMO_CATEGORIES`.

- [ ] **Step 1: Define domain types**

Use ISO date strings and these exact discriminants:

```ts
export type CatalogItemType = "active" | "product";
export type CatalogSort = "name-asc" | "name-desc" | "recent";
export interface Category { id: string; name: string; slug: string; createdAt: string; updatedAt: string }
export interface CatalogItem {
  id: string; name: string; slug: string; type: CatalogItemType; categoryId: string;
  shortDescription: string; keywords: string[]; imagePath: string | null;
  active: boolean; createdAt: string; updatedAt: string;
}
export type CatalogItemInput = Omit<CatalogItem, "id" | "slug" | "createdAt" | "updatedAt">;
export interface CatalogQuery {
  q: string; type: CatalogItemType | "all"; categoryId: string | "all";
  sort: CatalogSort; cursor: number; limit: number;
}
export interface CatalogPage { items: CatalogItem[]; total: number; nextCursor: number | null }
export interface CatalogStats { total: number; actives: number; products: number; enabled: number }
export const DEFAULT_QUERY: CatalogQuery = { q: "", type: "all", categoryId: "all", sort: "name-asc", cursor: 0, limit: 24 };
```

- [ ] **Step 2: Write failing search, slug and validation tests**

Tests must assert:

```ts
expect(normalizeText("  Magnésio Ácido  ")).toBe("magnesio acido");
expect(slugify("Saúde Intestinal")).toBe("saude-intestinal");
expect(buildSearchDocument(item, category)).toContain("magnesio");
expect(matchesCatalogQuery(item, category, { ...DEFAULT_QUERY, q: "magnesio" })).toBe(true);
expect(sortCatalogItems(items, "name-asc")[0].name).toBe("Berberina");
expect(catalogItemSchema.safeParse({ ...validInput, shortDescription: "x".repeat(321) }).success).toBe(false);
expect(catalogItemSchema.safeParse({ ...validInput, keywords: Array(21).fill("tag") }).success).toBe(false);
```

- [ ] **Step 3: Run tests and confirm failure**

Run: `npm test -- src/lib/domain`  
Expected: FAIL because functions and schemas are missing.

- [ ] **Step 4: Implement normalization, filtering and schemas**

`normalizeText` must use `value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim().replace(/\s+/g, " ")`. `buildSearchDocument` concatenates item name, translated type, category name, description and keywords. `matchesCatalogQuery` applies query, type and category. `sortCatalogItems` uses `localeCompare("pt-BR", { sensitivity: "base" })` or descending timestamps.

Use Zod to enforce required name/category/description, the 320-character description limit, 20 keyword limit and 40-character keyword limit. `categorySchema` enforces a name of 2–80 characters.

- [ ] **Step 5: Add exact demonstration data and tests**

Create 13 categories and 18 stable-ID items. Include Berberina, Coenzima Q10, Magnésio Bisglicinato, Melatonina, Vitamina D3 and Creatina; include at least four products, one inactive item, varied timestamps and keywords. The seed test asserts 13 categories, 18 items, valid references, unique IDs/slugs and successful Zod parsing.

- [ ] **Step 6: Run and commit**

Run: `npm test -- src/lib/domain src/lib/data/demo/seed.test.ts`  
Expected: PASS.

```bash
git add src/lib/domain src/lib/data/demo/seed.ts src/lib/data/demo/seed.test.ts
git commit -m "feat: add catalog domain and demo seed"
```

---

### Task 3: Repository contracts and persistent demo data

**Files:**
- Create: `src/lib/data/contracts.ts`
- Create: `src/lib/data/errors.ts`
- Create: `src/lib/data/demo/database.ts`, `src/lib/data/demo/database.test.ts`
- Create: `src/lib/data/demo/catalog-repository.ts`, `src/lib/data/demo/catalog-repository.test.ts`
- Create: `src/lib/data/demo/category-repository.ts`, `src/lib/data/demo/category-repository.test.ts`

**Interfaces:**
- Produces: `CatalogRepository`, `CategoryRepository`, `AuthRepository`, `ImageRepository`, `Repositories`.
- Produces: `DemoDatabase`, `readDemoDatabase`, `writeDemoDatabase`, `resetDemoDatabase`.
- Produces: `DemoCatalogRepository` and `DemoCategoryRepository`.

- [ ] **Step 1: Define repository contracts**

```ts
export interface CatalogRepository {
  listPublic(query: CatalogQuery): Promise<CatalogPage>;
  listAdmin(query: CatalogQuery): Promise<CatalogPage>;
  getStats(): Promise<CatalogStats>;
  listRecent(limit: number): Promise<CatalogItem[]>;
  getById(id: string): Promise<CatalogItem | null>;
  create(input: CatalogItemInput): Promise<CatalogItem>;
  update(id: string, input: CatalogItemInput): Promise<CatalogItem>;
  remove(id: string): Promise<void>;
  setActive(id: string, active: boolean): Promise<CatalogItem>;
}
export interface CategoryRepository {
  list(): Promise<Category[]>;
  create(input: { name: string }): Promise<Category>;
  update(id: string, input: { name: string }): Promise<Category>;
  remove(id: string): Promise<void>;
}
```

Define typed errors `NotFoundError`, `ConflictError`, `UnauthorizedError`, `ValidationError` with stable `code` values for UI messages.

- [ ] **Step 2: Write failing persistence tests**

Tests in jsdom must clear storage before each case and assert:

```ts
expect(readDemoDatabase().items).toHaveLength(18);
writeDemoDatabase({ ...readDemoDatabase(), items: [] });
expect(readDemoDatabase().items).toHaveLength(0);
resetDemoDatabase();
expect(readDemoDatabase().items).toHaveLength(18);
```

- [ ] **Step 3: Implement versioned local persistence**

Use key `biomedic:demo:v1`. Parse stored JSON with a Zod database schema. If missing or invalid, clone the immutable seed. Writes serialize a `DemoDatabase` containing `version: 1`, `items` and `categories`.

- [ ] **Step 4: Write failing repository behavior tests**

Cover public exclusion of inactive items, accent-insensitive search, type/category filters, sorting, 24-item cursor behavior, dashboard stats, recent-item limiting, CRUD persistence, unique slugs, missing IDs, and category deletion conflict. Explicitly assert:

```ts
await expect(categoryRepository.remove(categoryInUseId)).rejects.toMatchObject({ code: "conflict" });
expect((await catalogRepository.listPublic(DEFAULT_QUERY)).items.every((item) => item.active)).toBe(true);
```

- [ ] **Step 5: Implement demo repositories**

Repositories must read fresh state per operation, validate inputs with shared schemas, create IDs with `crypto.randomUUID()`, generate collision-safe slugs (`slug`, `slug-2`, ...), update `updatedAt`, and persist only after the operation succeeds. `listPublic` filters inactive items before applying the query; `listAdmin` includes all items.

- [ ] **Step 6: Run and commit**

Run: `npm test -- src/lib/data/demo`  
Expected: PASS.

```bash
git add src/lib/data/contracts.ts src/lib/data/errors.ts src/lib/data/demo
git commit -m "feat: add persistent demo repositories"
```

---

### Task 4: Demo authentication, image storage and repository provider

**Files:**
- Create: `src/lib/data/demo/auth-repository.ts`, `src/lib/data/demo/auth-repository.test.ts`
- Create: `src/lib/data/demo/image-repository.ts`, `src/lib/data/demo/image-repository.test.ts`
- Create: `src/lib/data/demo/optimize-image.ts`, `src/lib/data/demo/optimize-image.test.ts`
- Create: `src/lib/data/demo/repositories.ts`
- Create: `src/lib/data/provider.tsx`, `src/lib/data/use-repositories.ts`
- Create: `src/lib/data/provider.test.tsx`

**Interfaces:**
- Produces: `AdminSession { userId; email; name; role: "admin" }`.
- Produces: `DemoAuthRepository`, `DemoImageRepository`, `optimizeCatalogImage(file): Promise<Blob>`.
- Produces: `<DataProvider>` and `useRepositories(): Repositories`.

- [ ] **Step 1: Add auth and image contracts**

```ts
export interface AuthRepository {
  getSession(): Promise<AdminSession | null>;
  login(email: string, password: string): Promise<AdminSession>;
  logout(): Promise<void>;
}
export interface ImageRepository {
  upload(itemId: string, file: File): Promise<string>;
  remove(path: string): Promise<void>;
  getUrl(path: string | null): Promise<string | null>;
}
```

- [ ] **Step 2: Write failing demo login tests**

Assert that `admin@biomedic.demo` / `BioMedic@2026` creates a persisted admin session, wrong credentials throw `UnauthorizedError`, logout clears it, and a new repository instance reads the existing session.

- [ ] **Step 3: Implement demo authentication**

Use a separate key `biomedic:demo-session:v1`. Store only the demo session, never the password. Normalize the email before comparison.

- [ ] **Step 4: Write failing image validation and storage tests**

Assert rejection of unsupported MIME and files over `5 * 1024 * 1024`, IndexedDB keys under `catalog/<itemId>/<uuid>.webp`, URL creation for stored blobs, and deletion. Mock canvas and `URL.createObjectURL` deterministically.

- [ ] **Step 5: Implement image optimization and IndexedDB repository**

Decode with `createImageBitmap`, calculate a scale no larger than 1, draw to an `OffscreenCanvas` when supported or a DOM canvas fallback, and encode WebP at quality 0.84. Store blobs in database `biomedic-demo`, object store `catalog-images`. Revoke object URLs when replaced or the provider unmounts.

- [ ] **Step 6: Implement and test the provider**

`DataProvider` resolves `NEXT_PUBLIC_DATA_MODE`, creates repositories once with `useMemo`, and exposes them through a context that throws a descriptive error outside the provider. Initially support demo; the Supabase branch added in Task 10 must implement the same interface.

- [ ] **Step 7: Run and commit**

Run: `npm test -- src/lib/data/demo src/lib/data/provider.test.tsx`  
Expected: PASS.

```bash
git add src/lib/data
git commit -m "feat: add demo auth images and data provider"
```

---

### Task 5: Public shell, homepage and institutional content

**Files:**
- Create: `src/lib/config/content.ts`
- Create: `src/components/public/header.tsx`, `footer.tsx`, `mobile-nav.tsx`
- Create: `src/components/public/hero-search.tsx`, `featured-catalog.tsx`, `about-section.tsx`, `contact-section.tsx`
- Create: `src/components/public/hero-search.test.tsx`, `header-footer.test.tsx`
- Create: `src/components/catalog/catalog-card.tsx`, `catalog-card.test.tsx`, `catalog-grid.tsx`
- Create: `src/app/(public)/layout.tsx`, `src/app/(public)/page.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `CatalogItem`, `Category`, `DataProvider`.
- Produces: `CatalogCard({ item, category, imageUrl })` with no interactive card wrapper.
- Produces: `HeroSearch` routing to `/catalogo?q=<encoded>`.

- [ ] **Step 1: Centralize approved institutional content**

Export the exact phone, WhatsApp, schedule, address, map URL and approved institutional paragraph from `content.ts`. Use `tel:+554130145765`, `https://wa.me/5541998942185`, `https://wa.me/5541999640217`, and a URL-encoded Google Maps search for the address.

- [ ] **Step 2: Write failing public component tests**

Render a card and assert name, translated type, category and description are present. Assert `queryByRole("link")` and `queryByRole("button")` return null inside the card. Test hero submission navigates to `/catalogo?q=magnesio`. Test footer contains both WhatsApp links and no payment text.

- [ ] **Step 3: Run tests and confirm failure**

Run: `npm test -- src/components/public src/components/catalog/catalog-card.test.tsx`  
Expected: FAIL because the components do not exist.

- [ ] **Step 4: Implement public shell and card system**

Use `next/image` for the logo and stored image URL. Cards use a fixed aspect ratio, badge, category, 320-character-safe description and up to three keyword tags hidden below the desktop breakpoint. Header has Início, Catálogo, Sobre a BioMedic, Contato and a subdued Área Administrativa link. Mobile navigation uses Sheet with focus management.

- [ ] **Step 5: Implement homepage**

Compose hero, a client `FeaturedCatalog` that requests the first six active A–Z items through `CatalogRepository.listPublic`, about and contact. The search form trims input and pushes `/catalogo` with `q` only when non-empty. Use real BioMedic contact data and no commerce language.

- [ ] **Step 6: Run accessibility smoke and commit**

Run: `npm test -- src/components/public src/components/catalog` and `npm run typecheck`.  
Expected: PASS.

```bash
git add public/brand src/app src/components/public src/components/catalog src/lib/config/content.ts
git commit -m "feat: build BioMedic public homepage"
```

---

### Task 6: Searchable and filterable public catalog

**Files:**
- Create: `src/features/catalog/use-catalog-query.ts`, `use-catalog-query.test.tsx`
- Create: `src/components/catalog/search-bar.tsx`, `catalog-filters.tsx`, `sort-select.tsx`
- Create: `src/components/catalog/results-summary.tsx`, `catalog-skeleton.tsx`, `catalog-empty-state.tsx`, `catalog-error-state.tsx`
- Create: `src/components/catalog/catalog-browser.tsx`, `catalog-browser.test.tsx`
- Create: `src/app/(public)/catalogo/page.tsx`, `loading.tsx`

**Interfaces:**
- Consumes: `CatalogRepository.listPublic`, `CategoryRepository.list`.
- Produces: `useCatalogQuery()` returning `{ query, setSearch, setType, setCategory, setSort, loadMore, reset, state }`.

- [ ] **Step 1: Write failing query-state tests**

With mocked repositories and router, assert initial URL parsing, 250 ms debounce, reset of cursor on filter change, URL parameters `q`, `type`, `category` and `sort`, append on `loadMore`, stale response protection, and default omission of `sort=name-asc`.

- [ ] **Step 2: Implement query controller**

Keep input text immediate, debounce only repository calls and URL replacement. Use `AbortController` or a monotonically increasing request ID so older searches cannot overwrite newer results. Fetch categories once per provider instance. State discriminants are `loading`, `success`, `empty`, and `error`.

- [ ] **Step 3: Write failing catalog browser tests**

Test `8 resultados para “magnésio”`, `42 itens disponíveis`, type/category selection, A–Z default, retry after a rejected query, empty-state reset, and mobile filter Sheet labels.

- [ ] **Step 4: Implement catalog UI**

Desktop uses inline type chips, category select and sort select. Mobile exposes a `Filtros` button and Sheet. Search has a visible label for screen readers, clear button, and `aria-live` result summary. `CatalogGrid` uses four/three/two/one responsive columns and cards remain non-clickable.

- [ ] **Step 5: Verify and commit**

Run:

```bash
npm test -- src/features/catalog src/components/catalog
npm run typecheck
npm run lint
```

Expected: PASS.

```bash
git add src/features/catalog src/components/catalog src/app/'(public)'/catalogo
git commit -m "feat: add searchable public catalog"
```

---

### Task 7: Administrative login, route guard, layout and dashboard

**Files:**
- Create: `src/features/auth/use-admin-session.ts`, `use-admin-session.test.tsx`
- Create: `src/components/admin/admin-sidebar.tsx`, `admin-header.tsx`, `demo-mode-notice.tsx`
- Create: `src/components/admin/dashboard-stats.tsx`, `recent-items.tsx`
- Create: `src/app/admin/login/page.tsx`, `login-form.tsx`, `login-form.test.tsx`
- Create: `src/app/admin/(protected)/layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`
- Create: `src/middleware.ts`

**Interfaces:**
- Consumes: `AuthRepository` and admin listing repositories.
- Produces: `useAdminSession()` and protected admin shell.

- [ ] **Step 1: Write failing login/session tests**

Assert demo credentials are visible, wrong login shows `E-mail ou senha inválidos.`, successful login routes to `/admin`, logout routes to `/admin/login`, protected layout shows a loading state while session resolves, and missing session redirects.

- [ ] **Step 2: Implement login and session hook**

Use React Hook Form + Zod for email/password. Never log the password. Disable submit while authenticating. `useAdminSession` exposes `{ session, status, login, logout }` where status is `loading | authenticated | unauthenticated`.

- [ ] **Step 3: Implement protected shell**

Desktop sidebar includes Visão geral, Catálogo and Categorias. Mobile uses Sheet. Show demo notice only when data mode is demo. Add `noindex, nofollow` metadata to the admin subtree.

- [ ] **Step 4: Implement dashboard with tests**

Read `CatalogRepository.getStats()`, `CategoryRepository.list()` and `CatalogRepository.listRecent(5)`. Show total items, active type, product type, categories, enabled items and five newest items. Add skeleton, retry and empty states. A fixture with 14 active-type items, four products, 17 enabled items and 13 categories must render those exact values.

- [ ] **Step 5: Add production middleware behavior**

In demo mode, allow the request and let the client session guard redirect. In Supabase mode, refresh cookies with `@supabase/ssr` and redirect unauthenticated `/admin/*` requests except `/admin/login`. Do not place service-role keys in middleware.

- [ ] **Step 6: Verify and commit**

Run: `npm test -- src/features/auth src/app/admin src/components/admin` and `npm run typecheck`.  
Expected: PASS.

```bash
git add src/features/auth src/components/admin src/app/admin src/middleware.ts
git commit -m "feat: add protected admin dashboard"
```

---

### Task 8: Administrative catalog CRUD and image workflow

**Files:**
- Create: `src/features/catalog/use-catalog-admin.ts`, `use-catalog-admin.test.tsx`
- Create: `src/components/admin/catalog-table.tsx`, `catalog-row-actions.tsx`, `status-badge.tsx`
- Create: `src/components/forms/catalog-form.tsx`, `catalog-form.test.tsx`
- Create: `src/components/forms/keywords-input.tsx`, `image-uploader.tsx`
- Create: `src/components/feedback/delete-confirmation-dialog.tsx`
- Create: `src/app/admin/(protected)/catalogo/page.tsx`
- Create: `src/app/admin/(protected)/catalogo/novo/page.tsx`
- Create: `src/app/admin/(protected)/catalogo/[id]/editar/page.tsx`

**Interfaces:**
- Consumes: `CatalogRepository`, `CategoryRepository`, `ImageRepository`, shared schemas.
- Produces: catalog list/admin actions and reusable `CatalogForm` with create/edit modes.

- [ ] **Step 1: Write failing form and admin-hook tests**

Cover required fields, description/keyword limits, tag addition/removal, image MIME/size errors, create, edit, active toggle, delete confirmation, success toasts and typed repository failures. Assert no mutation occurs before delete confirmation.

- [ ] **Step 2: Implement `useCatalogAdmin`**

Expose `load`, `create`, `update`, `setActive`, `remove` and `retry`. Re-fetch authoritative data after mutation. Map stable error codes to Portuguese messages; unknown errors show `Não foi possível concluir a ação.`.

- [ ] **Step 3: Implement table and row actions**

Desktop table columns are Imagem, Nome, Tipo, Categoria, Status, Criação and Ações. Mobile uses stacked rows preserving the same information. Row actions include Editar, Ativar/Desativar and Excluir. Focus returns to the triggering action after a canceled dialog.

- [ ] **Step 4: Implement catalog form and image transaction**

Create flow: create the item, upload an optional image using the returned item ID, then update `imagePath`; if upload fails, retain the item without image and show a recoverable warning. Edit flow: upload new image first, update item with new path, then remove the previous image; if the item update fails, delete the newly uploaded blob. Image removal updates the item before deleting the old blob.

- [ ] **Step 5: Implement routes and feedback**

New and edit pages share `CatalogForm`; edit shows a not-found state for unknown IDs. Successful creation routes to `/admin/catalogo`; successful edit remains on the page with `Alterações salvas.`. Use Sonner toasts with `aria-live` support.

- [ ] **Step 6: Verify and commit**

Run:

```bash
npm test -- src/features/catalog/use-catalog-admin.test.tsx src/components/forms src/components/admin
npm run typecheck
npm run lint
```

Expected: PASS.

```bash
git add src/features/catalog src/components/admin src/components/forms src/components/feedback src/app/admin/'(protected)'/catalogo
git commit -m "feat: add admin catalog management"
```

---

### Task 9: Category management and demo reset

**Files:**
- Create: `src/features/categories/use-categories-admin.ts`, `use-categories-admin.test.tsx`
- Create: `src/components/forms/category-form.tsx`, `category-form.test.tsx`
- Create: `src/components/admin/category-list.tsx`
- Create: `src/components/admin/restore-demo-dialog.tsx`, `restore-demo-dialog.test.tsx`
- Create: `src/app/admin/(protected)/categorias/page.tsx`
- Modify: `src/components/admin/admin-sidebar.tsx`, `src/components/admin/admin-header.tsx`

**Interfaces:**
- Consumes: `CategoryRepository`, `resetDemoDatabase`, `ImageRepository` cleanup.
- Produces: complete category CRUD and explicit `restoreDemo()` action.

- [ ] **Step 1: Write failing category tests**

Test create with generated slug, rename, duplicate-name conflict, blocked delete while in use, successful unused delete, form errors, confirmation text containing the category name, and translated error copy.

- [ ] **Step 2: Implement category management**

Use inline create/edit forms on desktop and Dialog on small screens. On `ConflictError`, show `Mova os itens desta categoria antes de excluí-la.` and keep the dialog open.

- [ ] **Step 3: Write failing reset tests**

Assert the dialog contains `Restaurar dados de demonstração?`, requires explicit confirmation, resets to 18 items and 13 categories, clears demo image blobs, preserves the authenticated demo session, routes to `/admin`, and announces success.

- [ ] **Step 4: Implement demo reset**

Expose it only in demo mode inside the admin user menu. Disable controls while clearing IndexedDB and restoring local seed. Never show this action in Supabase mode.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- src/features/categories src/components/forms/category-form.test.tsx src/components/admin/restore-demo-dialog.test.tsx`.  
Expected: PASS.

```bash
git add src/features/categories src/components/forms/category-form.tsx src/components/admin src/app/admin/'(protected)'/categorias
git commit -m "feat: add category management and demo reset"
```

---

### Task 10: Supabase schema, RLS, Storage and production adapters

**Files:**
- Create: `supabase/migrations/202608160001_catalog.sql`
- Create: `supabase/seed.sql`
- Create: `src/lib/data/supabase/client.ts`, `server.ts`, `middleware.ts`
- Create: `src/lib/data/supabase/catalog-repository.ts`, `category-repository.ts`
- Create: `src/lib/data/supabase/auth-repository.ts`, `image-repository.ts`
- Create: `src/lib/data/supabase/mappers.ts`, `mappers.test.ts`
- Modify: `src/lib/data/provider.tsx`, `src/middleware.ts`, `next.config.ts`, `.env.example`
- Create: `docs/supabase-setup.md`

**Interfaces:**
- Consumes: all repository contracts from Task 3 and Task 4.
- Produces: `createBrowserSupabaseRepositories()` and server/middleware Supabase clients.

- [ ] **Step 1: Write mapper contract tests**

Use snake_case database fixtures and assert exact mapping to camelCase domain types, including `image_path`, `short_description`, timestamps, keywords and joined category data. Assert an invalid enum fails loudly rather than being coerced.

- [ ] **Step 2: Create enums, tables, triggers and indexes migration**

The SQL migration must:

```sql
create extension if not exists pg_trgm;
create type public.app_role as enum ('admin');
create type public.catalog_item_type as enum ('active', 'product');
```

Create the three tables exactly as the spec, foreign keys with `on delete restrict`, unique slugs, `updated_at` trigger, normalized `search_document`, a trigger on item writes, and a category-name trigger that refreshes related item search documents. Add GIN trigram and B-tree/compound public-query indexes.

- [ ] **Step 3: Add RLS and Storage policies**

Create a `security definer` function `public.is_admin()` with `set search_path = ''` that queries `public.profiles` for `auth.uid()`. Enable RLS on all three tables. Policies must allow:

```text
catalog_items SELECT: active = true OR is_admin()
catalog_items INSERT/UPDATE/DELETE: is_admin()
categories SELECT: true
categories INSERT/UPDATE/DELETE: is_admin()
profiles SELECT: id = auth.uid()
storage catalog-images SELECT: bucket_id = 'catalog-images'
storage catalog-images INSERT/UPDATE/DELETE: bucket_id = 'catalog-images' AND is_admin()
```

Insert the public `catalog-images` bucket idempotently. Revoke `execute` on trigger/normalization helpers from `public`, `anon` and `authenticated`. Grant `execute` on `is_admin()` only to `authenticated`. Use separate public-active and authenticated-admin SELECT policies so anonymous reads never need permission to call `is_admin()`.

- [ ] **Step 4: Add SQL seed and setup documentation**

Seed the same 13 categories and 18 items using stable UUIDs and idempotent `on conflict` clauses. Document project creation, migration command, creating the Auth user, inserting the matching `profiles` row, environment variables, bucket verification and a manual RLS matrix using anonymous and authenticated sessions. State clearly that service-role keys never enter browser variables.

- [ ] **Step 5: Implement Supabase clients and repositories**

Browser client uses `createBrowserClient`; server and middleware use `createServerClient` with cookie adapters. Add a `security invoker` RPC `search_catalog_items(p_query text, p_type catalog_item_type, p_category_id uuid, p_sort text, p_offset integer, p_limit integer, p_include_inactive boolean)` returning the catalog row fields plus `total_count bigint`. Validate `p_sort` against `name-asc`, `name-desc` and `recent`; clamp limit to 1–100; require `is_admin()` when `p_include_inactive` is true; let table RLS apply to the function caller. `SupabaseCatalogRepository.listPublic` calls it with `p_include_inactive=false`; `listAdmin` uses true. Implement `getStats()` with four exact-count queries and `listRecent(limit)` ordered by `created_at desc`; both require the authenticated admin policies. Category repository maps Postgres conflict `23503` to `ConflictError` and uniqueness `23505` to a Portuguese validation conflict. Auth reads the profile after sign-in and rejects non-admin users. Image repository limits the bucket path to `catalog/<itemId>/<uuid>.webp`.

- [ ] **Step 6: Connect provider mode and remote images**

When `NEXT_PUBLIC_DATA_MODE=supabase`, require URL and anon key and build Supabase repositories. In `next.config.ts`, allow `next/image` only for the hostname parsed from `NEXT_PUBLIC_SUPABASE_URL`. Demo remains the default and must not require either variable.

- [ ] **Step 7: Verify adapters and migration static guarantees**

Run:

```bash
npm test -- src/lib/data/supabase
rg -n "enable row level security|is_admin|catalog-images|search_document" supabase/migrations/202608160001_catalog.sql
npm run typecheck
```

Expected: mapper/repository tests pass and every required SQL control is present. If Docker and Supabase CLI are available, also run `npx supabase start`, `npx supabase db reset`, and `npx supabase db lint`; otherwise record that live RLS verification awaits a Supabase environment, as stated in the approved spec.

- [ ] **Step 8: Commit**

```bash
git add supabase src/lib/data/supabase src/lib/data/provider.tsx src/middleware.ts next.config.ts .env.example docs/supabase-setup.md
git commit -m "feat: add Supabase schema and adapters"
```

---

### Task 11: SEO, responsive/accessibility polish and end-to-end verification

**Files:**
- Create: `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/error.tsx`, `src/app/not-found.tsx`
- Create: `tests/e2e/public-catalog.spec.ts`
- Create: `tests/e2e/admin-auth.spec.ts`
- Create: `tests/e2e/admin-catalog.spec.ts`
- Create: `tests/e2e/admin-categories.spec.ts`
- Create: `tests/e2e/responsive.spec.ts`
- Create: `README.md`
- Modify: public/admin components found by accessibility and responsive review

**Interfaces:**
- Consumes: the complete demo application.
- Produces: documented local workflow and verified primary journeys.

- [ ] **Step 1: Add metadata, robots, sitemap and error boundaries**

Public metadata uses the approved title/description and an Open Graph image based on the brand. Robots allows `/` and `/catalogo` and disallows `/admin`. Sitemap contains only public routes. Global error and not-found pages provide safe recovery links without exposing stack traces.

- [ ] **Step 2: Write public Playwright flows**

Test that homepage hero routes a `magnesio` search, Magnésio Bisglicinato appears, cards contain no price/buy/detail controls, type/category/sort filters change results and URL, empty state can reset filters, and load-more works with a test fixture exceeding 24 items.

- [ ] **Step 3: Write admin Playwright flows**

Test incorrect/correct demo login, persisted session after reload, item creation/edit/toggle/delete, image upload/replace/remove with fixture files, category create/edit, blocked category deletion, unused category deletion, seed restoration, logout and protected-route redirect.

- [ ] **Step 4: Add responsive and keyboard checks**

At 390 × 844 assert mobile nav and filter Sheet open, catalog remains readable, admin rows stack without horizontal viewport overflow, dialogs trap focus, Escape closes overlays and focus returns to the trigger. At 768 × 1024 and 1440 × 900 assert expected grid/sidebar layouts. Check `document.documentElement.scrollWidth <= window.innerWidth` on every tested route.

- [ ] **Step 5: Run automated verification and fix every failure**

Run:

```bash
npm run lint
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

Expected: zero lint errors, zero TypeScript errors, all unit/component/E2E tests pass, and production build exits 0. Fix root causes and rerun the affected command, then rerun the full sequence.

- [ ] **Step 6: Perform browser visual verification**

Start `npm run dev`; inspect `/`, `/catalogo`, `/admin/login`, `/admin`, `/admin/catalogo`, item form and categories at mobile/tablet/desktop sizes. Check console errors, broken images, loading/empty/error states, contrast, hover/focus, long Portuguese strings and the exact logo rendering. Capture findings in the final commit body; do not accept horizontal overflow or inaccessible unlabeled controls.

- [ ] **Step 7: Write operating documentation**

README must document prerequisites, `npm install`, environment setup, demo credentials, `npm run dev`, all verification commands, demo reset, switch to Supabase, migrations, admin bootstrap, image rules and scope exclusions.

- [ ] **Step 8: Final commit**

```bash
git add src/app src/components tests README.md
git commit -m "test: verify complete BioMedic catalog flows"
```

Run `git status --short` and confirm no intended project files remain untracked or modified.
