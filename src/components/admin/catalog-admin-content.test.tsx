import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { resetDemoDatabase } from "@/lib/data/demo/database";
import { createDemoRepositories } from "@/lib/data/demo/repositories";
import { RepositoryContext } from "@/lib/data/provider";
import { CatalogAdminContent } from "./catalog-admin-content";

vi.mock("next/navigation", () => ({ usePathname: () => "/admin/catalogo" }));

describe("CatalogAdminContent", () => {
  beforeEach(() => {
    localStorage.clear();
    resetDemoDatabase();
  });

  it("requires explicit confirmation before deleting an item", async () => {
    const user = userEvent.setup();
    const repositories = createDemoRepositories();
    render(
      <RepositoryContext.Provider value={repositories}>
        <CatalogAdminContent />
      </RepositoryContext.Provider>,
    );

    const row = await screen.findByRole("row", { name: /Berberina/ });
    await user.click(within(row).getByRole("button", { name: "Excluir Berberina" }));

    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
    await expect(repositories.catalog.getStats()).resolves.toMatchObject({ total: 18 });

    await user.click(screen.getByRole("button", { name: "Excluir definitivamente" }));
    await waitFor(() => expect(screen.queryByRole("row", { name: /Berberina/ })).not.toBeInTheDocument());
    await expect(repositories.catalog.getStats()).resolves.toMatchObject({ total: 17 });
  });
});
