import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";

import { resetDemoDatabase } from "@/lib/data/demo/database";
import { createDemoRepositories } from "@/lib/data/demo/repositories";
import { RepositoryContext } from "@/lib/data/provider";
import { useCatalogAdmin } from "./use-catalog-admin";

const repositories = createDemoRepositories();

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <RepositoryContext.Provider value={repositories}>
      {children}
    </RepositoryContext.Provider>
  );
}

describe("useCatalogAdmin", () => {
  beforeEach(() => {
    localStorage.clear();
    resetDemoDatabase();
  });

  it("loads every item including inactive records", async () => {
    const { result } = renderHook(() => useCatalogAdmin(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.state.status).toBe("success"));
    expect(result.current.state.items).toHaveLength(18);
    expect(result.current.state.items.some(({ active }) => !active)).toBe(true);
    expect(result.current.state.categories).toHaveLength(13);
  });

  it("changes status and reloads authoritative data", async () => {
    const { result } = renderHook(() => useCatalogAdmin(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.state.status).toBe("success"));
    const item = result.current.state.items.find(({ active }) => active)!;

    await act(async () => result.current.setActive(item.id, false));

    expect(result.current.state.items.find(({ id }) => id === item.id)?.active).toBe(false);
  });

  it("removes an item after the caller confirms", async () => {
    const { result } = renderHook(() => useCatalogAdmin(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.state.status).toBe("success"));
    const item = result.current.state.items[0];

    await act(async () => result.current.remove(item.id));

    expect(result.current.state.items).toHaveLength(17);
    expect(result.current.state.items.some(({ id }) => id === item.id)).toBe(false);
  });
});
