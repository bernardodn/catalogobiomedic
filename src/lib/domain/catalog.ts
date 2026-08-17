export type CatalogSort = "name-asc" | "name-desc" | "recent";

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  keywords: string[];
  imagePath: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CatalogItemInput = Omit<
  CatalogItem,
  "id" | "slug" | "createdAt" | "updatedAt"
>;

export interface CatalogQuery {
  q: string;
  categoryId: string | "all";
  sort: CatalogSort;
  cursor: number;
  limit: number;
}

export interface CatalogPage {
  items: CatalogItem[];
  total: number;
  nextCursor: number | null;
}

export interface CatalogStats {
  total: number;
  enabled: number;
}

export const DEFAULT_QUERY: CatalogQuery = {
  q: "",
  categoryId: "all",
  sort: "name-asc",
  cursor: 0,
  limit: 24,
};
