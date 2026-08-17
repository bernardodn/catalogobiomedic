"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  DEFAULT_QUERY,
  type CatalogItem,
  type CatalogQuery,
  type CatalogSort,
  type Category,
} from "@/lib/domain/catalog";
import { useRepositories } from "@/lib/data/use-repositories";

type CatalogStatus = "loading" | "success" | "empty" | "error";

export interface CatalogViewState {
  status: CatalogStatus;
  items: CatalogItem[];
  categories: Category[];
  imageUrls: Record<string, string | null>;
  total: number;
  nextCursor: number | null;
  loadingMore: boolean;
  error: string | null;
}

function parseSort(value: string | null): CatalogSort {
  return value === "name-desc" || value === "recent" ? value : "name-asc";
}

function queryFromParams(params: URLSearchParams): CatalogQuery {
  return {
    ...DEFAULT_QUERY,
    q: params.get("q")?.trim() ?? "",
    categoryId: params.get("category")?.trim() || "all",
    sort: parseSort(params.get("sort")),
  };
}

function queryToParams(query: CatalogQuery): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.categoryId !== "all") params.set("category", query.categoryId);
  if (query.sort !== "name-asc") params.set("sort", query.sort);
  return params.toString();
}

export function useCatalogQuery() {
  const repositories = useRepositories();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState<CatalogQuery>(() => queryFromParams(searchParams));
  const [search, setSearchValue] = useState(query.q);
  const [retryKey, setRetryKey] = useState(0);
  const requestId = useRef(0);
  const categoriesPromise = useRef<Promise<Category[]> | null>(null);
  const [state, setState] = useState<CatalogViewState>({
    status: "loading",
    items: [],
    categories: [],
    imageUrls: {},
    total: 0,
    nextCursor: null,
    loadingMore: false,
    error: null,
  });

  const resolveImages = useCallback(
    async (items: CatalogItem[]) =>
      Object.fromEntries(
        await Promise.all(
          items.map(async (item) => [item.id, await repositories.images.getUrl(item.imagePath)] as const),
        ),
      ),
    [repositories.images],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuery((current) => ({ ...current, q: search.trim(), cursor: 0 }));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const params = queryToParams(query);
    router.replace(params ? `${pathname}?${params}` : pathname, { scroll: false });
  }, [pathname, query, router]);

  useEffect(() => {
    const currentRequest = ++requestId.current;
    categoriesPromise.current ??= repositories.categories.list();

    void Promise.all([
      repositories.catalog.listPublic({ ...query, cursor: 0, limit: 24 }),
      categoriesPromise.current,
    ])
      .then(async ([page, categories]) => {
        const imageUrls = await resolveImages(page.items);
        if (currentRequest !== requestId.current) return;
        setState({
          status: page.total === 0 ? "empty" : "success",
          items: page.items,
          categories,
          imageUrls,
          total: page.total,
          nextCursor: page.nextCursor,
          loadingMore: false,
          error: null,
        });
      })
      .catch(() => {
        if (currentRequest !== requestId.current) return;
        setState((current) => ({
          ...current,
          status: "error",
          loadingMore: false,
          error: "Não foi possível carregar o catálogo.",
        }));
      });
  }, [query, repositories, resolveImages, retryKey]);

  const setCategory = useCallback((categoryId: string | "all") => {
    setQuery((current) => ({ ...current, categoryId, cursor: 0 }));
  }, []);

  const setSort = useCallback((sort: CatalogSort) => {
    setQuery((current) => ({ ...current, sort, cursor: 0 }));
  }, []);

  const loadMore = useCallback(async () => {
    if (state.nextCursor === null || state.loadingMore) return;
    setState((current) => ({ ...current, loadingMore: true }));
    try {
      const page = await repositories.catalog.listPublic({
        ...query,
        cursor: state.nextCursor,
        limit: 24,
      });
      const imageUrls = await resolveImages(page.items);
      setState((current) => ({
        ...current,
        status: "success",
        items: [...current.items, ...page.items],
        imageUrls: { ...current.imageUrls, ...imageUrls },
        nextCursor: page.nextCursor,
        loadingMore: false,
      }));
    } catch {
      setState((current) => ({ ...current, loadingMore: false }));
    }
  }, [query, repositories.catalog, resolveImages, state.loadingMore, state.nextCursor]);

  const reset = useCallback(() => {
    setSearchValue("");
    setQuery(DEFAULT_QUERY);
  }, []);

  return {
    search,
    query,
    state,
    setSearch: setSearchValue,
    setCategory,
    setSort,
    loadMore,
    retry: () => setRetryKey((value) => value + 1),
    reset,
  };
}
