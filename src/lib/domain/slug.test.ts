import { describe, expect, it } from "vitest";

import { slugify } from "./slug";

describe("slugify", () => {
  it("normalizes Portuguese names into URL-safe slugs", () => {
    expect(slugify("  Saúde Intestinal & Bem-estar  ")).toBe(
      "saude-intestinal-bem-estar",
    );
  });

  it("rejects names without letters or numbers", () => {
    expect(() => slugify("---")).toThrow("Não foi possível gerar o slug.");
  });
});
