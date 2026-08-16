import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createDemoRepositories } from "@/lib/data/demo/repositories";
import { resetDemoDatabase } from "@/lib/data/demo/database";
import { DemoCatalogRepository } from "@/lib/data/demo/catalog-repository";
import { RepositoryContext } from "@/lib/data/provider";
import { CatalogBrowser } from "./catalog-browser";

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

describe("CatalogBrowser", () => {
  beforeEach(() => {
    localStorage.clear();
    resetDemoDatabase();
    replace.mockClear();
    currentParams = new URLSearchParams();
  });

  it("shows public totals and filters by item type", async () => {
    const user = userEvent.setup();
    render(<CatalogBrowser />, { wrapper: Wrapper });

    expect(await screen.findByText("17 itens disponíveis")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Produtos" }));

    expect(await screen.findByText("4 produtos disponíveis")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Complexo B" })).toBeInTheDocument();
  });

  it("shows the searched term and lets the user recover from an empty result", async () => {
    const user = userEvent.setup();
    render(<CatalogBrowser />, { wrapper: Wrapper });

    await user.type(
      screen.getByRole("searchbox", { name: "Pesquisar no catálogo" }),
      "termo inexistente",
    );

    expect(await screen.findByRole("heading", { name: "Nenhum item encontrado" })).toBeInTheDocument();
    expect(screen.getByText('0 resultados para “termo inexistente”')).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Limpar busca e filtros" }));
    expect(await screen.findByText("17 itens disponíveis")).toBeInTheDocument();
  });

  it("retries a failed catalog request", async () => {
    class FailOnceRepository extends DemoCatalogRepository {
      private failed = false;

      override async listPublic(...args: Parameters<DemoCatalogRepository["listPublic"]>) {
        if (!this.failed) {
          this.failed = true;
          throw new Error("offline");
        }
        return super.listPublic(...args);
      }
    }

    const repositories = createDemoRepositories();
    repositories.catalog = new FailOnceRepository();
    const user = userEvent.setup();
    render(
      <RepositoryContext.Provider value={repositories}>
        <CatalogBrowser />
      </RepositoryContext.Provider>,
    );

    expect(await screen.findByText("Não foi possível carregar o catálogo.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));

    await waitFor(() => expect(screen.getByText("17 itens disponíveis")).toBeInTheDocument());
  });
});
