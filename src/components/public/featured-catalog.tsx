"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { CatalogGrid } from "@/components/catalog/catalog-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_QUERY, type CatalogItem, type Category } from "@/lib/domain/catalog";
import { useRepositories } from "@/lib/data/use-repositories";

interface FeaturedState {
  items: CatalogItem[];
  categories: Category[];
  imageUrls: Record<string, string | null>;
}

export function FeaturedCatalog() {
  const repositories = useRepositories();
  const [state, setState] = useState<FeaturedState | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    void Promise.all([
      repositories.catalog.listPublic({ ...DEFAULT_QUERY, limit: 6 }),
      repositories.categories.list(),
    ])
      .then(async ([page, categories]) => {
        const entries = await Promise.all(
          page.items.map(async (item) => [item.id, await repositories.images.getUrl(item.imagePath)] as const),
        );
        if (active) setState({ items: page.items, categories, imageUrls: Object.fromEntries(entries) });
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [repositories]);

  return (
    <section className="py-20">
      <div className="page-container">
        <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-medium text-primary">Consulta rápida</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Destaques do catálogo
            </h2>
          </div>
          <Link href="/catalogo" className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            Ver catálogo completo <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        {failed ? (
          <p className="border p-6 text-sm text-muted-foreground">
            Não foi possível carregar os destaques agora. Consulte o catálogo completo.
          </p>
        ) : state ? (
          <CatalogGrid {...state} />
        ) : (
          <div className="grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="bg-background p-4">
                <Skeleton className="aspect-[8/5] w-full rounded-sm" />
                <Skeleton className="mt-5 h-5 w-2/3 rounded-sm" />
                <Skeleton className="mt-3 h-14 w-full rounded-sm" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
