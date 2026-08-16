import type { CatalogQuery } from "@/lib/domain/catalog";

export function ResultsSummary({ total, query }: { total: number; query: CatalogQuery }) {
  let label: string;
  if (query.q) {
    label = `${total} ${total === 1 ? "resultado" : "resultados"} para “${query.q}”`;
  } else if (query.type === "active") {
    label = `${total} ${total === 1 ? "ativo disponível" : "ativos disponíveis"}`;
  } else if (query.type === "product") {
    label = `${total} ${total === 1 ? "produto disponível" : "produtos disponíveis"}`;
  } else {
    label = `${total} ${total === 1 ? "item disponível" : "itens disponíveis"}`;
  }

  return (
    <p className="text-sm font-semibold text-brand-navy" aria-live="polite">
      {label}
    </p>
  );
}
