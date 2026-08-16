import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { CatalogItem, Category } from "@/lib/domain/catalog";
import { CatalogCard } from "./catalog-card";

const category: Category = {
  id: "00000000-0000-4000-8000-000000000002",
  name: "Minerais",
  slug: "minerais",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

const item: CatalogItem = {
  id: "10000000-0000-4000-8000-000000000003",
  name: "Magnésio Bisglicinato",
  slug: "magnesio-bisglicinato",
  type: "active",
  categoryId: category.id,
  shortDescription: "Mineral disponível para formulações manipuladas.",
  keywords: ["magnésio", "sono", "relaxamento", "mineral"],
  imagePath: null,
  active: true,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

describe("CatalogCard", () => {
  it("shows every piece of information needed for a quick consultation", () => {
    render(<CatalogCard item={item} category={category} imageUrl={null} />);

    expect(screen.getByRole("heading", { name: item.name })).toBeInTheDocument();
    expect(screen.getByText("Ativo")).toBeInTheDocument();
    expect(screen.getByText(category.name)).toBeInTheDocument();
    expect(screen.getByText(item.shortDescription)).toBeInTheDocument();
    expect(screen.getByText("magnésio")).toBeInTheDocument();
  });

  it("does not expose commerce or navigation controls", () => {
    render(<CatalogCard item={item} category={category} imageUrl={null} />);
    const card = screen.getByTestId("catalog-card");

    expect(within(card).queryByRole("link")).not.toBeInTheDocument();
    expect(within(card).queryByRole("button")).not.toBeInTheDocument();
    expect(within(card).queryByText(/comprar|preço|saiba mais/i)).not.toBeInTheDocument();
  });
});
