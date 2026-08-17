import { z } from "zod";

import type { CatalogItem, Category } from "@/lib/domain/catalog";
import { catalogItemSchema, categorySchema } from "@/lib/domain/schemas";
import { DEMO_CATEGORIES, DEMO_ITEMS } from "./seed";

export const DEMO_DATABASE_KEY = "biomedic:demo:v1";

export interface DemoDatabase {
  version: 2;
  items: CatalogItem[];
  categories: Category[];
}

const categoryRecordSchema = categorySchema.extend({
  id: z.uuid(),
  slug: z.string().min(1),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

const itemRecordSchema = catalogItemSchema.extend({
  id: z.uuid(),
  slug: z.string().min(1),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

const databaseSchema = z.object({
  version: z.literal(2),
  items: z.array(itemRecordSchema),
  categories: z.array(categoryRecordSchema),
});

const legacyItemRecordSchema = itemRecordSchema.extend({
  type: z.enum(["active", "product"]),
});

const legacyDatabaseSchema = z.object({
  version: z.literal(1),
  items: z.array(legacyItemRecordSchema),
  categories: z.array(categoryRecordSchema),
});

function cloneSeed(): DemoDatabase {
  return structuredClone({
    version: 2 as const,
    items: DEMO_ITEMS,
    categories: DEMO_CATEGORIES,
  });
}

export function writeDemoDatabase(database: DemoDatabase): void {
  databaseSchema.parse(database);
  localStorage.setItem(DEMO_DATABASE_KEY, JSON.stringify(database));
}

export function readDemoDatabase(): DemoDatabase {
  if (typeof localStorage === "undefined") return cloneSeed();

  const stored = localStorage.getItem(DEMO_DATABASE_KEY);
  if (!stored) return cloneSeed();

  try {
    const parsed = JSON.parse(stored);
    const current = databaseSchema.safeParse(parsed);
    if (current.success) return structuredClone(current.data);

    const legacy = legacyDatabaseSchema.parse(parsed);
    const migrated: DemoDatabase = {
      version: 2,
      items: legacy.items.map((item) =>
        Object.fromEntries(Object.entries(item).filter(([key]) => key !== "type")) as CatalogItem,
      ),
      categories: legacy.categories,
    };
    writeDemoDatabase(migrated);
    return structuredClone(migrated);
  } catch {
    const seed = cloneSeed();
    writeDemoDatabase(seed);
    return seed;
  }
}

export function resetDemoDatabase(): DemoDatabase {
  const seed = cloneSeed();
  writeDemoDatabase(seed);
  return structuredClone(seed);
}
