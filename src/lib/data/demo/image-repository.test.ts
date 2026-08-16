import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DemoImageRepository } from "./image-repository";

const optimize = vi.fn(async () => new Blob(["optimized"], { type: "image/webp" }));

describe("DemoImageRepository", () => {
  beforeEach(async () => {
    optimize.mockClear();
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:catalog-image");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    await new DemoImageRepository(optimize).clear();
  });

  afterEach(() => vi.restoreAllMocks());

  it("optimizes and persists an uploaded image in IndexedDB", async () => {
    const repository = new DemoImageRepository(optimize);
    const file = new File(["source"], "source.png", { type: "image/png" });

    const path = await repository.upload("item-1", file);

    expect(path).toMatch(/^catalog\/item-1\/[a-f0-9-]+\.webp$/);
    await expect(new DemoImageRepository(optimize).getUrl(path)).resolves.toBe(
      "blob:catalog-image",
    );
  });

  it("returns public asset paths without consulting IndexedDB", async () => {
    const repository = new DemoImageRepository(optimize);

    await expect(repository.getUrl("/brand/catalog-placeholder.svg")).resolves.toBe(
      "/brand/catalog-placeholder.svg",
    );
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });

  it("removes the stored blob and revokes its object URL", async () => {
    const repository = new DemoImageRepository(optimize);
    const path = await repository.upload(
      "item-1",
      new File(["source"], "source.png", { type: "image/png" }),
    );
    await repository.getUrl(path);

    await repository.remove(path);

    await expect(repository.getUrl(path)).resolves.toBeNull();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:catalog-image");
  });
});
