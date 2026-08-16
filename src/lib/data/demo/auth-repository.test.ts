import { beforeEach, describe, expect, it } from "vitest";

import { UnauthorizedError } from "@/lib/data/errors";
import { DemoAuthRepository } from "./auth-repository";

describe("DemoAuthRepository", () => {
  beforeEach(() => localStorage.clear());

  it("authenticates the documented demo administrator", async () => {
    const repository = new DemoAuthRepository();

    await expect(
      repository.login("  ADMIN@BIOMEDIC.DEMO ", "BioMedic@2026"),
    ).resolves.toEqual({
      userId: "demo-admin",
      email: "admin@biomedic.demo",
      name: "Administrador BioMedic",
      role: "admin",
    });
  });

  it("persists only the session between repository instances", async () => {
    await new DemoAuthRepository().login("admin@biomedic.demo", "BioMedic@2026");

    const rawSession = localStorage.getItem("biomedic:demo-session:v1");
    expect(rawSession).not.toContain("BioMedic@2026");
    await expect(new DemoAuthRepository().getSession()).resolves.toMatchObject({
      role: "admin",
    });
  });

  it("rejects invalid credentials without creating a session", async () => {
    const repository = new DemoAuthRepository();

    await expect(
      repository.login("admin@biomedic.demo", "wrong"),
    ).rejects.toBeInstanceOf(UnauthorizedError);
    await expect(repository.getSession()).resolves.toBeNull();
  });

  it("clears the session on logout", async () => {
    const repository = new DemoAuthRepository();
    await repository.login("admin@biomedic.demo", "BioMedic@2026");

    await repository.logout();

    await expect(repository.getSession()).resolves.toBeNull();
  });
});
