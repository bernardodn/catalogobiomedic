"use client";

import { useCallback, useEffect, useState } from "react";

import { DEFAULT_QUERY, type CatalogItem, type Category } from "@/lib/domain/catalog";
import { useRepositories } from "@/lib/data/use-repositories";
import type { Repositories } from "@/lib/data/contracts";

interface AdminCatalogState {
  status: "loading" | "success" | "error";
  items: CatalogItem[];
  categories: Category[];
  imageUrls: Record<string, string | null>;
  total: number;
  busyIds: string[];
  error: string | null;
}

const initialState: AdminCatalogState = {
  status: "loading",
  items: [],
  categories: [],
  imageUrls: {},
  total: 0,
  busyIds: [],
  error: null,
};

async function fetchCatalogAdmin(repositories: Repositories) {
  const [page, categories] = await Promise.all([
    repositories.catalog.listAdmin({ ...DEFAULT_QUERY, limit: 100 }),
    repositories.categories.list(),
  ]);
  const imageUrls = Object.fromEntries(
    await Promise.all(
      page.items.map(async (item) => [item.id, await repositories.images.getUrl(item.imagePath)] as const),
    ),
  );
  return { page, categories, imageUrls };
}

export function useCatalogAdmin() {
  const repositories = useRepositories();
  const [state, setState] = useState(initialState);

  const load = useCallback(async () => {
    try {
      const { page, categories, imageUrls } = await fetchCatalogAdmin(repositories);
      setState((current) => ({
        ...current,
        status: "success",
        items: page.items,
        categories,
        imageUrls,
        total: page.total,
        error: null,
      }));
    } catch {
      setState((current) => ({
        ...current,
        status: "error",
        error: "Não foi possível carregar os itens.",
      }));
    }
  }, [repositories]);

  useEffect(() => {
    let active = true;
    void fetchCatalogAdmin(repositories)
      .then(({ page, categories, imageUrls }) => {
        if (!active) return;
        setState((current) => ({ ...current, status: "success", items: page.items, categories, imageUrls, total: page.total, error: null }));
      })
      .catch(() => {
        if (active) setState((current) => ({ ...current, status: "error", error: "Não foi possível carregar os itens." }));
      });
    return () => { active = false; };
  }, [repositories]);

  const runItemMutation = useCallback(
    async (id: string, mutation: () => Promise<unknown>) => {
      setState((current) => ({ ...current, busyIds: [...current.busyIds, id] }));
      try {
        await mutation();
        await load();
      } finally {
        setState((current) => ({
          ...current,
          busyIds: current.busyIds.filter((busyId) => busyId !== id),
        }));
      }
    },
    [load],
  );

  const setActive = useCallback(
    (id: string, active: boolean) =>
      runItemMutation(id, () => repositories.catalog.setActive(id, active)),
    [repositories.catalog, runItemMutation],
  );

  const remove = useCallback(
    (id: string) => runItemMutation(id, () => repositories.catalog.remove(id)),
    [repositories.catalog, runItemMutation],
  );

  return { state, load, setActive, remove, retry: load };
}
