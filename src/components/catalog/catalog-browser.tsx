"use client";

import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCatalogQuery } from "@/features/catalog/use-catalog-query";
import { CatalogEmptyState } from "./catalog-empty-state";
import { CatalogErrorState } from "./catalog-error-state";
import { CatalogFilters } from "./catalog-filters";
import { CatalogGrid } from "./catalog-grid";
import { CatalogSkeleton } from "./catalog-skeleton";
import { ResultsSummary } from "./results-summary";
import { SearchBar } from "./search-bar";
import { SortSelect } from "./sort-select";

export function CatalogBrowser() {
  const catalog = useCatalogQuery();

  return (
    <div className="space-y-8">
      <SearchBar value={catalog.search} onChange={catalog.setSearch} />
      <div className="flex flex-wrap items-center justify-between gap-3 border-y py-4">
        <CatalogFilters
          type={catalog.query.type}
          categoryId={catalog.query.categoryId}
          categories={catalog.state.categories}
          onTypeChange={catalog.setType}
          onCategoryChange={catalog.setCategory}
        />
        <SortSelect value={catalog.query.sort} onChange={catalog.setSort} />
      </div>

      {catalog.state.status === "loading" ? <CatalogSkeleton /> : null}
      {catalog.state.status === "error" ? (
        <CatalogErrorState
          message={catalog.state.error ?? "Não foi possível carregar o catálogo."}
          onRetry={catalog.retry}
        />
      ) : null}
      {catalog.state.status === "empty" ? (
        <>
          <ResultsSummary total={0} query={catalog.query} />
          <CatalogEmptyState onReset={catalog.reset} />
        </>
      ) : null}
      {catalog.state.status === "success" ? (
        <>
          <div className="flex items-center justify-between gap-4">
            <ResultsSummary total={catalog.state.total} query={catalog.query} />
            <span className="text-xs text-muted-foreground">
              {catalog.state.items.length} exibidos
            </span>
          </div>
          <CatalogGrid
            items={catalog.state.items}
            categories={catalog.state.categories}
            imageUrls={catalog.state.imageUrls}
          />
          {catalog.state.nextCursor !== null ? (
            <div className="text-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => void catalog.loadMore()}
                disabled={catalog.state.loadingMore}
                className="rounded-sm"
              >
                {catalog.state.loadingMore ? (
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                ) : null}
                Carregar mais
              </Button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
