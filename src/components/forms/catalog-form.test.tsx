import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { createDemoRepositories } from "@/lib/data/demo/repositories";
import { RepositoryContext } from "@/lib/data/provider";
import { DEMO_CATEGORIES } from "@/lib/data/demo/seed";
import { CatalogForm } from "./catalog-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

describe("CatalogForm", () => {
  it("shows the required field errors without saving", async () => {
    const user = userEvent.setup();
    const repositories = createDemoRepositories();
    render(
      <RepositoryContext.Provider value={repositories}>
        <CatalogForm categories={DEMO_CATEGORIES} mode="create" />
      </RepositoryContext.Provider>,
    );

    await user.click(screen.getByRole("button", { name: /salvar item/i }));

    expect(await screen.findByText("Informe o nome.")).toBeInTheDocument();
    expect(screen.getByText("Informe a descrição curta.")).toBeInTheDocument();
  });

  it("turns entered keywords into removable chips", async () => {
    const user = userEvent.setup();
    const repositories = createDemoRepositories();
    render(
      <RepositoryContext.Provider value={repositories}>
        <CatalogForm categories={DEMO_CATEGORIES} mode="create" />
      </RepositoryContext.Provider>,
    );

    const input = screen.getByLabelText("Palavras-chave");
    await user.type(input, "antioxidante{Enter}");

    expect(screen.getByText("antioxidante")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Remover antioxidante" }));
    expect(screen.queryByText("antioxidante")).not.toBeInTheDocument();
  });
});
