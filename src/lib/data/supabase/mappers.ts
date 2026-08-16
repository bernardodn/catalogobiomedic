import type { CatalogItem, CatalogItemType, Category } from "@/lib/domain/catalog";

export interface CatalogRow {
  id: string;
  name: string;
  slug: string;
  type: string;
  category_id: string;
  short_description: string;
  keywords: string[];
  image_path: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

function mapType(value: string): CatalogItemType {
  if (value === "active" || value === "product") return value;
  throw new Error(`Tipo de item inválido recebido do banco: ${value}`);
}

export function mapCatalogItem(row: CatalogRow): CatalogItem {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    type: mapType(row.type),
    categoryId: row.category_id,
    shortDescription: row.short_description,
    keywords: row.keywords,
    imagePath: row.image_path,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
