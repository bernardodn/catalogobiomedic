import { beforeEach, describe, expect, it } from "vitest";

import { ConflictError, NotFoundError } from "@/lib/data/errors";
import { DemoCategoryRepository } from "./category-repository";
import { resetDemoDatabase } from "./database";

const repository = new DemoCategoryRepository();

describe("DemoCategoryRepository", () => {
  beforeEach(() => resetDemoDatabase());

  it("lists categories in Portuguese alphabetical order", async () => {
    const categories = await repository.list();

    expect(categories[0]?.name).toBe("Antioxidantes");
    expect(categories).toHaveLength(13);
  });

  it("creates and updates a persisted category", async () => {
    const created = await repository.create({ name: "  Longevidade  " });
    expect(created).toMatchObject({ name: "Longevidade", slug: "longevidade" });

    const updated = await repository.update(created.id, { name: "Vida saudável" });
    expect(updated).toMatchObject({ name: "Vida saudável", slug: "vida-saudavel" });
    expect((await repository.list()).some(({ id }) => id === created.id)).toBe(true);
  });

  it("rejects duplicate category names", async () => {
    await expect(repository.create({ name: "Vitaminas" })).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it("blocks deletion while catalog items use the category", async () => {
    const vitamins = (await repository.list()).find(({ slug }) => slug === "vitaminas");

    await expect(repository.remove(vitamins?.id ?? "missing")).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it("removes an unused category", async () => {
    const created = await repository.create({ name: "Longevidade" });

    await repository.remove(created.id);

    expect((await repository.list()).some(({ id }) => id === created.id)).toBe(false);
  });

  it("throws a typed error for unknown categories", async () => {
    await expect(repository.update("missing", { name: "Nova" })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
