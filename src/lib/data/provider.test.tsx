import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { DataProvider } from "./provider";
import { useRepositories } from "./use-repositories";

function Wrapper({ children }: { children: ReactNode }) {
  return <DataProvider>{children}</DataProvider>;
}

describe("DataProvider", () => {
  it("provides the functional demo repositories by default", async () => {
    const { result } = renderHook(() => useRepositories(), { wrapper: Wrapper });

    await expect(result.current.catalog.getStats()).resolves.toMatchObject({
      total: 18,
    });
    await expect(result.current.categories.list()).resolves.toHaveLength(13);
  });

  it("reports use outside of the provider", () => {
    expect(() => renderHook(() => useRepositories())).toThrow(
      "useRepositories deve ser usado dentro de DataProvider.",
    );
  });
});
