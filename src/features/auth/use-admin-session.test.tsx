import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";

import { createDemoRepositories } from "@/lib/data/demo/repositories";
import { RepositoryContext } from "@/lib/data/provider";
import { useAdminSession } from "./use-admin-session";

const repositories = createDemoRepositories();

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <RepositoryContext.Provider value={repositories}>
      {children}
    </RepositoryContext.Provider>
  );
}

describe("useAdminSession", () => {
  beforeEach(() => localStorage.clear());

  it("resolves an absent session", async () => {
    const { result } = renderHook(() => useAdminSession(), { wrapper: Wrapper });

    expect(result.current.status).toBe("loading");
    await waitFor(() => expect(result.current.status).toBe("unauthenticated"));
    expect(result.current.session).toBeNull();
  });

  it("logs in and exposes the administrator session", async () => {
    const { result } = renderHook(() => useAdminSession(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.status).toBe("unauthenticated"));

    await act(async () => {
      await result.current.login("admin@biomedic.demo", "BioMedic@2026");
    });

    expect(result.current.status).toBe("authenticated");
    expect(result.current.session?.name).toBe("Administrador BioMedic");
  });

  it("logs out and clears the current session", async () => {
    const { result } = renderHook(() => useAdminSession(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.status).toBe("unauthenticated"));
    await act(async () => {
      await result.current.login("admin@biomedic.demo", "BioMedic@2026");
      await result.current.logout();
    });

    expect(result.current.status).toBe("unauthenticated");
    expect(result.current.session).toBeNull();
  });
});
