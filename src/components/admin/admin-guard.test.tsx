import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DataProvider } from "@/lib/data/provider";
import { createDemoRepositories } from "@/lib/data/demo/repositories";
import { AdminGuard } from "./admin-guard";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

describe("AdminGuard", () => {
  beforeEach(() => {
    localStorage.clear();
    replace.mockClear();
  });

  it("redirects an unauthenticated visitor", async () => {
    render(
      <DataProvider>
        <AdminGuard>Conteúdo protegido</AdminGuard>
      </DataProvider>,
    );

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/admin/login"));
    expect(screen.queryByText("Conteúdo protegido")).not.toBeInTheDocument();
  });

  it("renders protected content for the demo administrator", async () => {
    await createDemoRepositories().auth.login(
      "admin@biomedic.demo",
      "BioMedic@2026",
    );

    render(
      <DataProvider>
        <AdminGuard>Conteúdo protegido</AdminGuard>
      </DataProvider>,
    );

    expect(await screen.findByText("Conteúdo protegido")).toBeInTheDocument();
  });
});
