"use client";

import { useContext } from "react";

import { RepositoryContext } from "./provider";

export function useRepositories() {
  const repositories = useContext(RepositoryContext);
  if (!repositories) {
    throw new Error("useRepositories deve ser usado dentro de DataProvider.");
  }
  return repositories;
}
