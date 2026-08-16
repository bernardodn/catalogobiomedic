import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CatalogFormScreen } from "@/components/admin/catalog-form-screen";

export const metadata: Metadata = { title: "Novo item" };

export default function NewCatalogItemPage() {
  return <div className="mx-auto max-w-5xl space-y-7"><Link href="/admin/catalogo" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" aria-hidden="true" />Voltar ao catálogo</Link><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Catálogo</p><h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Novo item</h1></div><CatalogFormScreen /></div>;
}
