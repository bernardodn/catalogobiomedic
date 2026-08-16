import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RepositoryContext } from "@/lib/data/provider";
import { createDemoRepositories } from "@/lib/data/demo/repositories";
import { DemoCatalogRepository } from "@/lib/data/demo/catalog-repository";
import { resetDemoDatabase } from "@/lib/data/demo/database";
import { useCatalogQuery } from "./use-catalog-query";

const replace = vi.fn();
let currentParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  usePathname: () => "/catalogo",
  useRouter: () => ({ replace }),
  useSearchParams: () => currentParams,
}));

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <RepositoryContext.Provider value={createDemoRepositories()}>
      {children}
    </RepositoryContext.Provider>
  );
}

describe("useCatalogQuery", () => {
  beforeEach(() => {
    localStorage.clear();
    resetDemoDatabase();
    replace.mockClear();
    currentParams = new URLSearchParams();
  });

  it("loads the initial query from the URL", async () => {
    currentParams = new URLSearchParams("q=magnesio&type=active&sort=name-desc");

    const { result } = renderHook(() => useCatalogQuery(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.state.status).toBe("success"));
    expect(result.current.search).toBe("magnesio");
    expect(result.current.query).toMatchObject({ type: "active", sort: "name-desc" });
    expect(result.current.state.items.map(({ name }) => name)).toEqual([
      "Magnésio Bisglicinato",
    ]);
  });

  it("updates the input immediately and applies search after debounce", async () => {
    const { result } = renderHook(() => useCatalogQuery(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.state.status).toBe("success"));

    act(() => result.current.setSearch("zinco"));
    expect(result.current.search).toBe("zinco");

    await waitFor(
      () =>
        expect(result.current.state.items.map(({ name }) => name)).toEqual([
          "Zinco Quelado",
        ]),
      { timeout: 1000 },
    );
    expect(replace).toHaveBeenLastCalledWith("/catalogo?q=zinco", { scroll: false });
  });

  it("combines filters and can reset them", async () => {
    const { result } = renderHook(() => useCatalogQuery(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.state.status).toBe("success"));

    act(() => result.current.setType("product"));
    await waitFor(() => expect(result.current.state.total).toBe(4));
    expect(replace).toHaveBeenLastCalledWith("/catalogo?type=product", {
      scroll: false,
    });

    act(() => result.current.reset());
    await waitFor(() => expect(result.current.state.total).toBe(17));
    expect(result.current.query.type).toBe("all");
  });

  it("does not let an older slow response replace a newer search", async () => {
    class DelayedRepository extends DemoCatalogRepository {
      override async listPublic(...args: Parameters<DemoCatalogRepository["listPublic"]>) {
        if (args[0].q === "slow") {
          await new Promise((resolve) => window.setTimeout(resolve, 500));
        }
        return super.listPublic(...args);
      }
    }

    currentParams = new URLSearchParams("q=slow");
    const repositories = createDemoRepositories();
    repositories.catalog = new DelayedRepository();
    const CustomWrapper = ({ children }: { children: ReactNode }) => (
      <RepositoryContext.Provider value={repositories}>
        {children}
      </RepositoryContext.Provider>
    );
    const { result } = renderHook(() => useCatalogQuery(), { wrapper: CustomWrapper });

    act(() => result.current.setSearch("magnesio"));
    await waitFor(
      () =>
        expect(result.current.state.items.map(({ name }) => name)).toEqual([
          "Magnésio Bisglicinato",
        ]),
      { timeout: 1000 },
    );

    await act(async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 350));
    });
    expect(result.current.state.items.map(({ name }) => name)).toEqual([
      "Magnésio Bisglicinato",
    ]);
  });

  it("appends the next result page", async () => {
    const repositories = createDemoRepositories();
    const categoryId = (await repositories.categories.list())[0].id;
    for (let index = 0; index < 8; index += 1) {
      await repositories.catalog.create({
        name: `Item adicional ${index + 1}`,
        type: "active",
        categoryId,
        shortDescription: "Item criado para verificar a paginação progressiva.",
        keywords: ["paginação"],
        imagePath: null,
        active: true,
      });
    }
    const CustomWrapper = ({ children }: { children: ReactNode }) => (
      <RepositoryContext.Provider value={repositories}>
        {children}
      </RepositoryContext.Provider>
    );
    const { result } = renderHook(() => useCatalogQuery(), { wrapper: CustomWrapper });
    await waitFor(() => expect(result.current.state.items).toHaveLength(24));

    await act(async () => result.current.loadMore());

    await waitFor(() => expect(result.current.state.items).toHaveLength(25));
    expect(result.current.state.nextCursor).toBeNull();
  });
});
