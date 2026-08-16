import { describe, expect, it } from "vitest";

import { optimizeCatalogImage } from "./optimize-image";

describe("optimizeCatalogImage", () => {
  it("rejects unsupported image formats before decoding", async () => {
    const file = new File(["image"], "catalog.gif", { type: "image/gif" });

    await expect(optimizeCatalogImage(file)).rejects.toThrow(
      "Use uma imagem PNG, JPEG ou WebP.",
    );
  });

  it("rejects files larger than five megabytes before decoding", async () => {
    const file = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "large.png", {
      type: "image/png",
    });

    await expect(optimizeCatalogImage(file)).rejects.toThrow(
      "A imagem deve ter no máximo 5 MB.",
    );
  });
});
