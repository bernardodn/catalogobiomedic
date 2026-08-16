import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CatalogItem, CatalogItemInput } from "@/lib/domain/catalog";
import { createDemoRepositories } from "@/lib/data/demo/repositories";
import { resetDemoDatabase } from "@/lib/data/demo/database";
import { saveCatalogItem } from "./save-catalog-item";

const input: CatalogItemInput = {
  name: "Novo ativo",
  type: "active",
  categoryId: "00000000-0000-4000-8000-000000000001",
  shortDescription: "Descrição técnica para o catálogo.",
  keywords: ["teste"],
  imagePath: null,
  active: true,
};

describe("saveCatalogItem", () => {
  beforeEach(() => {
    localStorage.clear();
    resetDemoDatabase();
  });

  it("keeps a newly created item when its image upload fails", async () => {
    const repositories = createDemoRepositories();
    vi.spyOn(repositories.images, "upload").mockRejectedValue(new Error("upload"));

    const result = await saveCatalogItem({
      repositories,
      input,
      file: new File(["image"], "item.png", { type: "image/png" }),
    });

    expect(result.item.name).toBe("Novo ativo");
    expect(result.item.imagePath).toBeNull();
    expect(result.warning).toMatch(/imagem/i);
    await expect(repositories.catalog.getById(result.item.id)).resolves.toMatchObject({
      name: "Novo ativo",
    });
  });

  it("removes a replacement image if updating an existing item fails", async () => {
    const repositories = createDemoRepositories();
    const current = (await repositories.catalog.listAdmin({
      q: "Berberina",
      type: "all",
      categoryId: "all",
      sort: "name-asc",
      cursor: 0,
      limit: 1,
    })).items[0] as CatalogItem;
    const upload = vi.spyOn(repositories.images, "upload").mockResolvedValue("catalog/new.webp");
    const remove = vi.spyOn(repositories.images, "remove").mockResolvedValue();
    vi.spyOn(repositories.catalog, "update").mockRejectedValue(new Error("update"));

    await expect(
      saveCatalogItem({
        repositories,
        current,
        input: { ...current, name: "Nome atualizado" },
        file: new File(["image"], "item.png", { type: "image/png" }),
      }),
    ).rejects.toThrow("update");

    expect(upload).toHaveBeenCalledWith(current.id, expect.any(File));
    expect(remove).toHaveBeenCalledWith("catalog/new.webp");
  });

  it("updates the record before deleting an intentionally removed image", async () => {
    const repositories = createDemoRepositories();
    const current = (await repositories.catalog.listAdmin({
      q: "Berberina",
      type: "all",
      categoryId: "all",
      sort: "name-asc",
      cursor: 0,
      limit: 1,
    })).items[0] as CatalogItem;
    const remove = vi.spyOn(repositories.images, "remove").mockResolvedValue();

    const result = await saveCatalogItem({
      repositories,
      current,
      input: { ...current, imagePath: current.imagePath },
      removeImage: true,
    });

    expect(result.item.imagePath).toBeNull();
    expect(remove).toHaveBeenCalledWith(current.imagePath);
  });
});
