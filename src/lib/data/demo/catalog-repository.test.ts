import { beforeEach, describe, expect, it } from "vitest";

import { DEFAULT_QUERY } from "@/lib/domain/catalog";
import { NotFoundError } from "@/lib/data/errors";
import { resetDemoDatabase } from "./database";
import { DemoCatalogRepository } from "./catalog-repository";

const repository = new DemoCatalogRepository();

describe("DemoCatalogRepository", () => {
  beforeEach(() => resetDemoDatabase());

  it("keeps inactive records out of the public catalog", async () => {
    const page = await repository.listPublic(DEFAULT_QUERY);

    expect(page.total).toBe(17);
    expect(page.items.every(({ active }) => active)).toBe(true);
  });

  it("searches without requiring accents", async () => {
    const page = await repository.listPublic({ ...DEFAULT_QUERY, q: "magnesio" });

    expect(page.items.map(({ name }) => name)).toContain("Magnésio Bisglicinato");
  });

  it("combines type and category filters", async () => {
    const categories = await import("./seed").then(({ DEMO_CATEGORIES }) =>
      DEMO_CATEGORIES,
    );
    const performanceId = categories.find(({ slug }) => slug === "performance")?.id;

    const page = await repository.listPublic({
      ...DEFAULT_QUERY,
      type: "product",
      categoryId: performanceId ?? "missing",
    });

    expect(page.total).toBe(1);
    expect(page.items[0]?.name).toBe("Recovery Performance");
  });

  it("paginates results using a numeric cursor", async () => {
    const firstPage = await repository.listPublic({ ...DEFAULT_QUERY, limit: 2 });
    const secondPage = await repository.listPublic({
      ...DEFAULT_QUERY,
      cursor: firstPage.nextCursor ?? -1,
      limit: 2,
    });

    expect(firstPage.nextCursor).toBe(2);
    expect(secondPage.items).toHaveLength(2);
    expect(secondPage.items.map(({ id }) => id)).not.toEqual(
      firstPage.items.map(({ id }) => id),
    );
  });

  it("returns dashboard statistics and recent items", async () => {
    await expect(repository.getStats()).resolves.toEqual({
      total: 18,
      actives: 14,
      products: 4,
      enabled: 17,
    });

    const recent = await repository.listRecent(3);
    expect(recent).toHaveLength(3);
    expect(recent[0]?.name).toBe("Recovery Performance");
  });

  it("persists create, update, status and delete operations", async () => {
    const categoryId = (await import("./seed")).DEMO_CATEGORIES[0].id;
    const created = await repository.create({
      name: "Ácido Hialurônico",
      type: "active",
      categoryId,
      shortDescription: "Ativo cadastrado durante o teste do catálogo.",
      keywords: ["pele"],
      imagePath: null,
      active: true,
    });

    expect(created.slug).toBe("acido-hialuronico");
    expect((await repository.getById(created.id))?.name).toBe("Ácido Hialurônico");

    const updated = await repository.update(created.id, {
      ...created,
      name: "Ácido Hialurônico Oral",
    });
    expect(updated.slug).toBe("acido-hialuronico-oral");

    await expect(repository.setActive(created.id, false)).resolves.toMatchObject({
      active: false,
    });

    await repository.remove(created.id);
    await expect(repository.getById(created.id)).resolves.toBeNull();
  });

  it("throws a typed error for missing mutations", async () => {
    await expect(repository.setActive("missing", false)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
