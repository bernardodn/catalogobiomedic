"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { CatalogForm } from "@/components/forms/catalog-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { CatalogItem, Category } from "@/lib/domain/catalog";
import { useRepositories } from "@/lib/data/use-repositories";

export function CatalogFormScreen({ itemId }: { itemId?: string }) {
  const repositories = useRepositories();
  const [data, setData] = useState<{ categories: Category[]; item?: CatalogItem; imageUrl?: string | null } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const categories = await repositories.categories.list();
        const item = itemId ? await repositories.catalog.getById(itemId) : undefined;
        if (itemId && !item) throw new Error("not-found");
        const imageUrl = item ? await repositories.images.getUrl(item.imagePath) : null;
        if (active) setData({ categories, item: item ?? undefined, imageUrl });
      } catch {
        if (active) setFailed(true);
      }
    })();
    return () => { active = false; };
  }, [itemId, repositories]);

  if (failed) return <div className="border bg-card p-10 text-center"><p>Não foi possível carregar este cadastro.</p><Button asChild variant="outline" className="mt-5 rounded-sm"><Link href="/admin/catalogo">Voltar ao catálogo</Link></Button></div>;
  if (!data) return <div className="space-y-4" aria-label="Carregando formulário"><Skeleton className="h-72 rounded-sm" /><Skeleton className="h-52 rounded-sm" /></div>;

  return <CatalogForm categories={data.categories} mode={itemId ? "edit" : "create"} initialItem={data.item} initialImageUrl={data.imageUrl} />;
}
