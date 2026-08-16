import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { CatalogItem, Category } from "@/lib/domain/catalog";

export function RecentItems({ items, categories }: { items: CatalogItem[]; categories: Category[] }) {
  const names = new Map(categories.map((category) => [category.id, category.name]));
  return (
    <section className="border bg-card">
      <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
        <h2 className="font-semibold">Últimos itens adicionados</h2>
        <Link href="/admin/catalogo" className="flex items-center gap-2 text-sm text-primary">
          Gerenciar catálogo <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="divide-y">
        {items.map((item) => (
          <div key={item.id} className="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-5">
            <div>
              <strong className="text-sm">{item.name}</strong>
              <p className="mt-1 text-xs text-muted-foreground">{names.get(item.categoryId)}</p>
            </div>
            <span className="text-xs text-muted-foreground">
              {item.type === "active" ? "Ativo" : "Produto"}
            </span>
            <Badge variant={item.active ? "secondary" : "outline"} className="w-fit rounded-sm">
              {item.active ? "Ativo" : "Inativo"}
            </Badge>
          </div>
        ))}
      </div>
    </section>
  );
}
