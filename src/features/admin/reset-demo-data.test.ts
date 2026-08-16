import { beforeEach, describe, expect, it, vi } from "vitest";

import { createDemoRepositories } from "@/lib/data/demo/repositories";
import { resetDemoData } from "./reset-demo-data";

describe("resetDemoData", () => {
  beforeEach(() => localStorage.clear());

  it("restores catalog data and images while preserving the signed-in session", async () => {
    const repositories = createDemoRepositories();
    await repositories.auth.login("admin@biomedic.demo", "BioMedic@2026");
    const item = (await repositories.catalog.listRecent(1))[0];
    await repositories.catalog.remove(item.id);
    const clear = vi.spyOn(repositories.images, "clear");

    await resetDemoData(repositories);

    await expect(repositories.catalog.getStats()).resolves.toMatchObject({ total: 18 });
    await expect(repositories.auth.getSession()).resolves.toMatchObject({ role: "admin" });
    expect(clear).toHaveBeenCalledOnce();
  });
});
