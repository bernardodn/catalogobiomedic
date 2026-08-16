import { describe, expect, it } from "vitest";

import { resolveDataMode } from "./env";

describe("resolveDataMode", () => {
  it("uses demo mode when configuration is absent", () => {
    expect(resolveDataMode()).toBe("demo");
  });

  it("accepts the Supabase mode explicitly", () => {
    expect(resolveDataMode("supabase")).toBe("supabase");
  });

  it("rejects unsupported data modes", () => {
    expect(() => resolveDataMode("other")).toThrow(
      "NEXT_PUBLIC_DATA_MODE inválido: other",
    );
  });
});
