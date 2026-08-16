import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Footer } from "./footer";
import { Header } from "./header";

describe("public navigation and contact", () => {
  it("shows the complete navigation with a subdued admin link", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: "Início" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Catálogo" })).toHaveAttribute(
      "href",
      "/catalogo",
    );
    expect(screen.getByRole("link", { name: "Área Administrativa" })).toHaveAttribute(
      "href",
      "/admin",
    );
  });

  it("uses the official contact channels without payment content", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: "WhatsApp (41) 99894-2185" })).toHaveAttribute(
      "href",
      "https://wa.me/5541998942185",
    );
    expect(screen.getByRole("link", { name: "WhatsApp (41) 99964-0217" })).toHaveAttribute(
      "href",
      "https://wa.me/5541999640217",
    );
    expect(screen.queryByText(/pague|visa|mastercard/i)).not.toBeInTheDocument();
  });
});
