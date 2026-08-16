"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { CatalogItem, CatalogStats, Category } from "@/lib/domain/catalog";
import { useRepositories } from "@/lib/data/use-repositories";
import { DashboardStats } from "./dashboard-stats";
import { RecentItems } from "./recent-items";

interface DashboardData {
  stats: CatalogStats;
  categories: Category[];
  recent: CatalogItem[];
}

export function DashboardContent() {
  const repositories = useRepositories();
  const [data, setData] = useState<DashboardData | null>(null);
  const [failed, setFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    void Promise.all([
      repositories.catalog.getStats(),
      repositories.categories.list(),
      repositories.catalog.listRecent(5),
    ])
      .then(([stats, categories, recent]) => {
        if (!active) return;
        setData({ stats, categories, recent });
        setFailed(false);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [repositories, retryKey]);

  if (failed) {
    return (
      <div className="border p-8 text-center">
        <p className="text-sm text-muted-foreground">Não foi possível carregar o painel.</p>
        <Button variant="outline" onClick={() => setRetryKey((value) => value + 1)} className="mt-5 rounded-sm">
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6" aria-label="Carregando painel">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-32 rounded-sm" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-sm" />
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <DashboardStats stats={data.stats} categories={data.categories.length} />
      <RecentItems items={data.recent} categories={data.categories} />
    </div>
  );
}
