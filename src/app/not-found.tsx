import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <main className="clinical-grid grid min-h-[70vh] place-items-center p-6"><div className="max-w-lg text-center"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Erro 404</p><h1 className="mt-4 text-4xl font-semibold tracking-tight text-brand-navy">Página não encontrada</h1><p className="mt-4 text-muted-foreground">O endereço informado não existe ou foi removido.</p><div className="mt-7 flex justify-center gap-3"><Button asChild className="rounded-sm"><Link href="/">Ir para o início</Link></Button><Button asChild variant="outline" className="rounded-sm"><Link href="/catalogo">Abrir catálogo</Link></Button></div></div></main>;
}
