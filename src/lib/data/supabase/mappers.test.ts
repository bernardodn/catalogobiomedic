import { describe, expect, it } from "vitest";

import { mapCatalogItem, mapCategory } from "./mappers";

describe("Supabase mappers", () => {
  it("maps snake_case catalog records without losing fields", () => {
    expect(mapCatalogItem({
      id: "10000000-0000-4000-8000-000000000001",
      name: "Berberina",
      slug: "berberina",
      type: "active",
      category_id: "00000000-0000-4000-8000-000000000003",
      short_description: "Descrição",
      keywords: ["metabolismo"],
      image_path: "catalog/item/image.webp",
      active: true,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-02T00:00:00Z",
    })).toEqual({
      id: "10000000-0000-4000-8000-000000000001",
      name: "Berberina",
      slug: "berberina",
      type: "active",
      categoryId: "00000000-0000-4000-8000-000000000003",
      shortDescription: "Descrição",
      keywords: ["metabolismo"],
      imagePath: "catalog/item/image.webp",
      active: true,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-02T00:00:00Z",
    });
  });

  it("maps category timestamps", () => {
    expect(mapCategory({
      id: "00000000-0000-4000-8000-000000000001",
      name: "Vitaminas",
      slug: "vitaminas",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-02T00:00:00Z",
    })).toMatchObject({ createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-02T00:00:00Z" });
  });

  it("fails loudly for an unknown catalog type", () => {
    expect(() => mapCatalogItem({
      id: "id", name: "Item", slug: "item", type: "service", category_id: "category",
      short_description: "Description", keywords: [], image_path: null, active: true,
      created_at: "date", updated_at: "date",
    })).toThrow(/tipo/i);
  });
});
