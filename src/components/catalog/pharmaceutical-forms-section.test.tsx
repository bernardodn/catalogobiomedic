import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PharmaceuticalFormsSection } from "./pharmaceutical-forms-section";

describe("PharmaceuticalFormsSection", () => {
  it("shows the available pharmaceutical forms and flavors", () => {
    render(<PharmaceuticalFormsSection />);

    expect(screen.getByRole("heading", { name: "Uma forma ideal para cada tratamento" })).toBeInTheDocument();
    expect(screen.getByText("Cápsula gastro resistente")).toBeInTheDocument();
    expect(screen.getByText("Solução capilar")).toBeInTheDocument();
    expect(screen.getByText("Maracujá")).toBeInTheDocument();
    expect(screen.getByText("Morango")).toBeInTheDocument();
  });
});
