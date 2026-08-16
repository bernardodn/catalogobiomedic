import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { resetDemoDatabase } from "@/lib/data/demo/database";
import { createDemoRepositories } from "@/lib/data/demo/repositories";
import { RepositoryContext } from "@/lib/data/provider";
import { CategoryAdminContent } from "./category-admin-content";

describe("CategoryAdminContent", () => {
  beforeEach(() => {
    localStorage.clear();
    resetDemoDatabase();
  });

  it("creates a category and adds it to the list", async () => {
    const user = userEvent.setup();
    const repositories = createDemoRepositories();
    render(<RepositoryContext.Provider value={repositories}><CategoryAdminContent /></RepositoryContext.Provider>);

    await screen.findByText("Antioxidantes");
    await user.type(screen.getByLabelText("Nome da categoria"), "Dermocosméticos");
    await user.click(screen.getByRole("button", { name: "Adicionar categoria" }));

    expect(await screen.findByText("Dermocosméticos")).toBeInTheDocument();
    await expect(repositories.categories.list()).resolves.toHaveLength(14);
  });

  it("explains why a category with linked items cannot be deleted", async () => {
    const user = userEvent.setup();
    const repositories = createDemoRepositories();
    render(<RepositoryContext.Provider value={repositories}><CategoryAdminContent /></RepositoryContext.Provider>);

    const deleteButton = await screen.findByRole("button", { name: "Excluir Antioxidantes" });
    await user.click(deleteButton);
    await user.click(screen.getByRole("button", { name: "Excluir categoria" }));

    expect(await screen.findByText("A categoria possui itens vinculados.")).toBeInTheDocument();
  });
});
