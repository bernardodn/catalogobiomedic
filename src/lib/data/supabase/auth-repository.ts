import type { SupabaseClient } from "@supabase/supabase-js";

import type { AdminSession, AuthRepository } from "@/lib/data/contracts";
import { UnauthorizedError } from "@/lib/data/errors";

interface ProfileRow { id: string; email: string; name: string; role: string }

export class SupabaseAuthRepository implements AuthRepository {
  constructor(private readonly client: SupabaseClient) {}

  private async adminSession(userId: string): Promise<AdminSession> {
    const { data, error } = await this.client.from("profiles").select("id,email,name,role").eq("id", userId).maybeSingle();
    const profile = data as ProfileRow | null;
    if (error || !profile || profile.role !== "admin") {
      await this.client.auth.signOut();
      throw new UnauthorizedError("Este usuário não possui acesso administrativo.");
    }
    return { userId: profile.id, email: profile.email, name: profile.name, role: "admin" };
  }

  async getSession(): Promise<AdminSession | null> {
    const { data, error } = await this.client.auth.getUser();
    if (error || !data.user) return null;
    try { return await this.adminSession(data.user.id); } catch { return null; }
  }

  async login(email: string, password: string): Promise<AdminSession> {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error || !data.user) throw new UnauthorizedError("E-mail ou senha inválidos.");
    return this.adminSession(data.user.id);
  }

  async logout(): Promise<void> {
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
  }
}
