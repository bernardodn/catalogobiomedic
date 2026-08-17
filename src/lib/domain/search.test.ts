import { describe, expect, it } from "vitest";

import type { CatalogItem, CatalogQuery, Category } from "./catalog";
import {
  buildSearchDocument,
  matchesCatalogQuery,
  normalizeText,
  sortCatalogItems,
} from "./search";

const category: Category = {
  id: "00000000-0000-4000-8000-000000000001",
  name: "Minerais",
  slug: "minerais",
  createdAt: "2026-01-01T10:00:00.000Z",
  updatedAt: "2026-01-01T10:00:00.000Z",
};

const item: CatalogItem = {
  id: "10000000-0000-4000-8000-000000000001",
  name: "Magnésio Bisglicinato",
  slug: "magnesio-bisglicinato",
  categoryId: category.id,
  shortDescription: "Mineral disponível para formulações manipuladas.",
  keywords: ["sono", "relaxamento"],
  imagePath: null,
  active: true,
  createdAt: "2026-02-01T10:00:00.000Z",
  updatedAt: "2026-02-01T10:00:00.000Z",
};

const baseQuery: CatalogQuery = {
  q: "",
  categoryId: "all",
  sort: "name-asc",
  cursor: 0,
  limit: 24,
};

describe("normalizeText", () => {
  it("removes accents, case differences and repeated spacing", () => {
    expect(normalizeText("  Magnésio   ÁCIDO  ")).toBe("magnesio acido");
  });
});

describe("catalog search", () => {
  it("builds a searchable document from every public field", () => {
    expect(buildSearchDocument(item, category)).toBe(
      "magnesio bisglicinato minerais mineral disponivel para formulacoes manipuladas. sono relaxamento",
    );
  });

  it("finds accented names using an unaccented query", () => {
    expect(matchesCatalogQuery(item, category, { ...baseQuery, q: "magnesio" })).toBe(
      true,
    );
  });

  it("filters by category", () => {
    expect(
      matchesCatalogQuery(item, category, {
        ...baseQuery,
        categoryId: category.id,
      }),
    ).toBe(true);
  });
});

describe("sortCatalogItems", () => {
  const older = { ...item, id: "older", name: "Zinco", createdAt: "2025-01-01T00:00:00Z" };
  const newer = { ...item, id: "newer", name: "Ácido alfa-lipoico", createdAt: "2026-01-01T00:00:00Z" };

  it("sorts names in Portuguese without accent bias", () => {
    expect(sortCatalogItems([older, newer], "name-asc").map(({ id }) => id)).toEqual([
      "newer",
      "older",
    ]);
  });

  it("sorts newest records first", () => {
    expect(sortCatalogItems([older, newer], "recent").map(({ id }) => id)).toEqual([
      "newer",
      "older",
    ]);
  });
});
