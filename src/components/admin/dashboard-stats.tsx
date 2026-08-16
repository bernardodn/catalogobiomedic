import { Boxes, CircleCheck, FlaskConical, Package, Tags } from "lucide-react";

import type { CatalogStats } from "@/lib/domain/catalog";

export function DashboardStats({ stats, categories }: { stats: CatalogStats; categories: number }) {
  const entries = [
    { label: "Total de itens", value: stats.total, icon: Boxes },
    { label: "Ativos", value: stats.actives, icon: FlaskConical },
    { label: "Produtos", value: stats.products, icon: Package },
    { label: "Categorias", value: categories, icon: Tags },
    { label: "Itens ativos", value: stats.enabled, icon: CircleCheck },
  ];

  return (
    <div className="grid gap-px border bg-border sm:grid-cols-2 xl:grid-cols-5">
      {entries.map(({ label, value, icon: Icon }) => (
        <div key={label} className="bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">{label}</span>
            <Icon className="size-4 text-primary" aria-hidden="true" />
          </div>
          <strong className="mt-5 block text-3xl font-semibold tracking-tight text-brand-navy">
            {value}
          </strong>
        </div>
      ))}
    </div>
  );
}
