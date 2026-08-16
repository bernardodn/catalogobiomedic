"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AppError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="grid min-h-[70vh] place-items-center p-6"><div className="max-w-lg border bg-card p-8 text-center"><p className="text-sm font-medium text-primary">BioMedic</p><h1 className="mt-3 text-2xl font-semibold">Algo não saiu como esperado</h1><p className="mt-3 text-sm text-muted-foreground">Tente carregar esta área novamente. Nenhum dado foi alterado por esta tela.</p><Button onClick={retry} className="mt-6 rounded-sm">Tentar novamente</Button></div></main>
  );
}
