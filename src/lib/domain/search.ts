import type {
  CatalogItem,
  CatalogQuery,
  CatalogSort,
  Category,
} from "./catalog";

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim()
    .replace(/\s+/g, " ");
}

export function buildSearchDocument(
  item: CatalogItem,
  category: Category,
): string {
  return normalizeText(
    [
      item.name,
      category.name,
      item.shortDescription,
      ...item.keywords,
    ].join(" "),
  );
}

export function matchesCatalogQuery(
  item: CatalogItem,
  category: Category,
  query: CatalogQuery,
): boolean {
  if (query.categoryId !== "all" && item.categoryId !== query.categoryId) {
    return false;
  }

  const normalizedQuery = normalizeText(query.q);
  return normalizedQuery === "" || buildSearchDocument(item, category).includes(normalizedQuery);
}

export function sortCatalogItems(
  items: CatalogItem[],
  sort: CatalogSort,
): CatalogItem[] {
  return [...items].sort((first, second) => {
    if (sort === "recent") {
      return second.createdAt.localeCompare(first.createdAt);
    }

    const direction = sort === "name-desc" ? -1 : 1;
    return (
      first.name.localeCompare(second.name, "pt-BR", { sensitivity: "base" }) *
      direction
    );
  });
}
