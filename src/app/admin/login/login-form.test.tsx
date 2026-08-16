import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DataProvider } from "@/lib/data/provider";
import { LoginForm } from "./login-form";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    localStorage.clear();
    replace.mockClear();
  });

  it("shows the documented demo credentials", () => {
    render(
      <DataProvider>
        <LoginForm />
      </DataProvider>,
    );

    expect(screen.getByText("admin@biomedic.demo")).toBeInTheDocument();
    expect(screen.getByText("BioMedic@2026")).toBeInTheDocument();
  });

  it("reports invalid credentials", async () => {
    const user = userEvent.setup();
    render(
      <DataProvider>
        <LoginForm />
      </DataProvider>,
    );

    await user.type(screen.getByLabelText("E-mail"), "admin@biomedic.demo");
    await user.type(screen.getByLabelText("Senha"), "incorreta");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("E-mail ou senha inválidos.")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("routes an authenticated administrator to the dashboard", async () => {
    const user = userEvent.setup();
    render(
      <DataProvider>
        <LoginForm />
      </DataProvider>,
    );

    await user.type(screen.getByLabelText("E-mail"), "admin@biomedic.demo");
    await user.type(screen.getByLabelText("Senha"), "BioMedic@2026");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(replace).toHaveBeenCalledWith("/admin");
  });
});
