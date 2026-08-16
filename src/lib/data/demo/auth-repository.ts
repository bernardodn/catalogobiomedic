import { z } from "zod";

import type { AdminSession, AuthRepository } from "@/lib/data/contracts";
import { UnauthorizedError } from "@/lib/data/errors";

const SESSION_KEY = "biomedic:demo-session:v1";
const DEMO_EMAIL = "admin@biomedic.demo";
const DEMO_PASSWORD = "BioMedic@2026";

const sessionSchema = z.object({
  userId: z.literal("demo-admin"),
  email: z.literal(DEMO_EMAIL),
  name: z.literal("Administrador BioMedic"),
  role: z.literal("admin"),
});

const DEMO_SESSION: AdminSession = {
  userId: "demo-admin",
  email: DEMO_EMAIL,
  name: "Administrador BioMedic",
  role: "admin",
};

export class DemoAuthRepository implements AuthRepository {
  async getSession(): Promise<AdminSession | null> {
    if (typeof localStorage === "undefined") return null;
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    try {
      return sessionSchema.parse(JSON.parse(stored));
    } catch {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  }

  async login(email: string, password: string): Promise<AdminSession> {
    if (email.trim().toLocaleLowerCase("pt-BR") !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      throw new UnauthorizedError("E-mail ou senha inválidos.");
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(DEMO_SESSION));
    return structuredClone(DEMO_SESSION);
  }

  async logout(): Promise<void> {
    localStorage.removeItem(SESSION_KEY);
  }
}
