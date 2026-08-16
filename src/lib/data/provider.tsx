"use client";

import { createContext, useState, type ReactNode } from "react";

import { resolveDataMode, type DataMode } from "@/lib/config/env";
import type { Repositories } from "./contracts";
import { createDemoRepositories } from "./demo/repositories";
import { createBrowserSupabaseRepositories } from "./supabase/repositories";

export const RepositoryContext = createContext<Repositories | null>(null);

interface DataProviderProps {
  children: ReactNode;
  mode?: DataMode;
}

export function DataProvider({ children, mode = resolveDataMode() }: DataProviderProps) {
  const [repositories] = useState<Repositories>(() => {
    if (mode === "demo") return createDemoRepositories();
    return createBrowserSupabaseRepositories();
  });

  return (
    <RepositoryContext.Provider value={repositories}>
      {children}
    </RepositoryContext.Provider>
  );
}
