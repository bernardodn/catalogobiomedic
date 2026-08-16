"use client";

import { Button } from "@/components/ui/button";

export default function AdminError({ retry }: { retry: () => void }) {
  return (
    <div className="border bg-card p-8 text-center">
      <h2 className="text-xl font-semibold">Não foi possível abrir esta área</h2>
      <p className="mt-2 text-sm text-muted-foreground">Tente carregar novamente.</p>
      <Button variant="outline" onClick={retry} className="mt-6 rounded-sm">
        Tentar novamente
      </Button>
    </div>
  );
}
