import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { HeroSearch } from "./hero-search";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("HeroSearch", () => {
  beforeEach(() => push.mockClear());

  it("opens the catalog with the trimmed search term", async () => {
    const user = userEvent.setup();
    render(<HeroSearch />);

    await user.type(
      screen.getByRole("searchbox", { name: "Pesquisar no catálogo" }),
      "  magnesio  ",
    );
    await user.click(screen.getByRole("button", { name: "Pesquisar" }));

    expect(push).toHaveBeenCalledWith("/catalogo?q=magnesio");
  });

  it("opens the complete catalog when the term is empty", async () => {
    const user = userEvent.setup();
    render(<HeroSearch />);

    await user.click(screen.getByRole("button", { name: "Pesquisar" }));

    expect(push).toHaveBeenCalledWith("/catalogo");
  });
});
