"use client";

import { useCallback, useEffect, useState } from "react";

import type { AdminSession } from "@/lib/data/contracts";
import { useRepositories } from "@/lib/data/use-repositories";

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

export function useAdminSession() {
  const { auth } = useRepositories();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");

  useEffect(() => {
    let active = true;
    void auth.getSession().then((current) => {
      if (!active) return;
      setSession(current);
      setStatus(current ? "authenticated" : "unauthenticated");
    });
    return () => {
      active = false;
    };
  }, [auth]);

  const login = useCallback(
    async (email: string, password: string) => {
      const current = await auth.login(email, password);
      setSession(current);
      setStatus("authenticated");
      return current;
    },
    [auth],
  );

  const logout = useCallback(async () => {
    await auth.logout();
    setSession(null);
    setStatus("unauthenticated");
  }, [auth]);

  return { session, status, login, logout };
}
