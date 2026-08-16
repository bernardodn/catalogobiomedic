import type {
  CatalogItem,
  CatalogItemInput,
  CatalogPage,
  CatalogQuery,
  CatalogStats,
} from "@/lib/domain/catalog";
import { catalogItemSchema } from "@/lib/domain/schemas";
import { matchesCatalogQuery, sortCatalogItems } from "@/lib/domain/search";
import { slugify } from "@/lib/domain/slug";
import type { CatalogRepository } from "@/lib/data/contracts";
import { NotFoundError, ValidationError } from "@/lib/data/errors";
import { readDemoDatabase, writeDemoDatabase } from "./database";

function uniqueSlug(name: string, items: CatalogItem[], currentId?: string): string {
  const base = slugify(name);
  const used = new Set(
    items.filter(({ id }) => id !== currentId).map(({ slug }) => slug),
  );
  if (!used.has(base)) return base;

  let suffix = 2;
  while (used.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

export class DemoCatalogRepository implements CatalogRepository {
  async listPublic(query: CatalogQuery): Promise<CatalogPage> {
    return this.list(query, false);
  }

  async listAdmin(query: CatalogQuery): Promise<CatalogPage> {
    return this.list(query, true);
  }

  async getStats(): Promise<CatalogStats> {
    const { items } = readDemoDatabase();
    return {
      total: items.length,
      actives: items.filter(({ type }) => type === "active").length,
      products: items.filter(({ type }) => type === "product").length,
      enabled: items.filter(({ active }) => active).length,
    };
  }

  async listRecent(limit: number): Promise<CatalogItem[]> {
    return sortCatalogItems(readDemoDatabase().items, "recent").slice(
      0,
      Math.max(0, limit),
    );
  }

  async getById(id: string): Promise<CatalogItem | null> {
    return readDemoDatabase().items.find((item) => item.id === id) ?? null;
  }

  async create(input: CatalogItemInput): Promise<CatalogItem> {
    const parsed = catalogItemSchema.parse(input);
    const database = readDemoDatabase();
    this.assertCategoryExists(parsed.categoryId, database.categories.map(({ id }) => id));
    const timestamp = new Date().toISOString();
    const created: CatalogItem = {
      ...parsed,
      id: crypto.randomUUID(),
      slug: uniqueSlug(parsed.name, database.items),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    database.items.push(created);
    writeDemoDatabase(database);
    return structuredClone(created);
  }

  async update(id: string, input: CatalogItemInput): Promise<CatalogItem> {
    const parsed = catalogItemSchema.parse(input);
    const database = readDemoDatabase();
    const index = database.items.findIndex((item) => item.id === id);
    if (index < 0) throw new NotFoundError("Item não encontrado.");
    this.assertCategoryExists(parsed.categoryId, database.categories.map(({ id }) => id));

    const updated: CatalogItem = {
      ...database.items[index],
      ...parsed,
      slug: uniqueSlug(parsed.name, database.items, id),
      updatedAt: new Date().toISOString(),
    };
    database.items[index] = updated;
    writeDemoDatabase(database);
    return structuredClone(updated);
  }

  async remove(id: string): Promise<void> {
    const database = readDemoDatabase();
    const index = database.items.findIndex((item) => item.id === id);
    if (index < 0) throw new NotFoundError("Item não encontrado.");
    database.items.splice(index, 1);
    writeDemoDatabase(database);
  }

  async setActive(id: string, active: boolean): Promise<CatalogItem> {
    const database = readDemoDatabase();
    const index = database.items.findIndex((item) => item.id === id);
    if (index < 0) throw new NotFoundError("Item não encontrado.");

    const updated = {
      ...database.items[index],
      active,
      updatedAt: new Date().toISOString(),
    };
    database.items[index] = updated;
    writeDemoDatabase(database);
    return structuredClone(updated);
  }

  private async list(query: CatalogQuery, includeInactive: boolean): Promise<CatalogPage> {
    const database = readDemoDatabase();
    const categories = new Map(database.categories.map((category) => [category.id, category]));
    const filtered = database.items.filter((item) => {
      const category = categories.get(item.categoryId);
      return (
        Boolean(category) &&
        (includeInactive || item.active) &&
        matchesCatalogQuery(item, category!, query)
      );
    });
    const sorted = sortCatalogItems(filtered, query.sort);
    const cursor = Math.max(0, query.cursor);
    const limit = Math.max(1, query.limit);
    const end = cursor + limit;

    return {
      items: sorted.slice(cursor, end),
      total: sorted.length,
      nextCursor: end < sorted.length ? end : null,
    };
  }

  private assertCategoryExists(categoryId: string, categoryIds: string[]): void {
    if (!categoryIds.includes(categoryId)) {
      throw new ValidationError("Selecione uma categoria válida.");
    }
  }
}
