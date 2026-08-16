import { describe, expect, it } from "vitest";

import { catalogItemSchema, categorySchema } from "./schemas";

const validInput = {
  name: "Magnésio Bisglicinato",
  type: "active" as const,
  categoryId: "00000000-0000-4000-8000-000000000001",
  shortDescription: "Mineral disponível para formulações manipuladas.",
  keywords: ["magnésio", "sono"],
  imagePath: null,
  active: true,
};

describe("catalogItemSchema", () => {
  it("accepts a complete valid catalog item", () => {
    expect(catalogItemSchema.safeParse(validInput).success).toBe(true);
  });

  it("rejects descriptions longer than 320 characters", () => {
    const result = catalogItemSchema.safeParse({
      ...validInput,
      shortDescription: "x".repeat(321),
    });

    expect(result.success).toBe(false);
  });

  it("rejects more than 20 keywords", () => {
    const result = catalogItemSchema.safeParse({
      ...validInput,
      keywords: Array.from({ length: 21 }, (_, index) => `tag-${index}`),
    });

    expect(result.success).toBe(false);
  });

  it("rejects keywords longer than 40 characters", () => {
    const result = catalogItemSchema.safeParse({
      ...validInput,
      keywords: ["x".repeat(41)],
    });

    expect(result.success).toBe(false);
  });
});

describe("categorySchema", () => {
  it("trims valid category names", () => {
    expect(categorySchema.parse({ name: "  Minerais  " })).toEqual({
      name: "Minerais",
    });
  });

  it("rejects single-character names", () => {
    expect(categorySchema.safeParse({ name: "M" }).success).toBe(false);
  });
});
