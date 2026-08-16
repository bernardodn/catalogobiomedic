import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CatalogEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="border px-6 py-16 text-center">
      <SearchX className="mx-auto size-8 text-primary" aria-hidden="true" />
      <h2 className="mt-5 text-xl font-semibold">Nenhum item encontrado</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Tente buscar outro termo ou remover algum filtro.
      </p>
      <Button type="button" variant="outline" onClick={onReset} className="mt-6 rounded-sm">
        Limpar busca e filtros
      </Button>
    </div>
  );
}
