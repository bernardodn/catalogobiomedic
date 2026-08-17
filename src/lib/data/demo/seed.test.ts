import { describe, expect, it } from "vitest";

import { catalogItemSchema, categorySchema } from "@/lib/domain/schemas";
import { DEMO_CATEGORIES, DEMO_ITEMS } from "./seed";

describe("BioMedic demonstration seed", () => {
  it("contains the approved number of categories and items", () => {
    expect(DEMO_CATEGORIES).toHaveLength(13);
    expect(DEMO_ITEMS).toHaveLength(18);
  });

  it("contains the required showcase items", () => {
    const names = DEMO_ITEMS.map(({ name }) => name);

    expect(names).toEqual(
      expect.arrayContaining([
        "Berberina",
        "Coenzima Q10",
        "Magnésio Bisglicinato",
        "Melatonina",
        "Vitamina D3",
        "Creatina",
      ]),
    );
  });

  it("covers the catalog and an inactive visibility state", () => {
    expect(DEMO_ITEMS.some(({ active }) => !active)).toBe(true);
    expect(DEMO_ITEMS.every((item) => !("type" in item))).toBe(true);
  });

  it("has valid, unique records with valid category references", () => {
    const categoryIds = new Set(DEMO_CATEGORIES.map(({ id }) => id));

    expect(new Set(DEMO_CATEGORIES.map(({ id }) => id)).size).toBe(13);
    expect(new Set(DEMO_CATEGORIES.map(({ slug }) => slug)).size).toBe(13);
    expect(new Set(DEMO_ITEMS.map(({ id }) => id)).size).toBe(18);
    expect(new Set(DEMO_ITEMS.map(({ slug }) => slug)).size).toBe(18);

    for (const category of DEMO_CATEGORIES) {
      expect(categorySchema.safeParse(category).success).toBe(true);
    }

    for (const item of DEMO_ITEMS) {
      expect(categoryIds.has(item.categoryId)).toBe(true);
      expect(catalogItemSchema.safeParse(item).success).toBe(true);
    }
  });
});
