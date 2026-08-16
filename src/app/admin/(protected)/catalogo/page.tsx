import type { Metadata } from "next";
import { CatalogAdminContent } from "@/components/admin/catalog-admin-content";

export const metadata: Metadata = { title: "Catálogo" };

export default function AdminCatalogPage() {
  return <div className="mx-auto max-w-7xl space-y-7"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Gestão do conteúdo</p><h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Catálogo</h1><p className="mt-2 text-sm text-muted-foreground">Cadastre, edite e controle a visibilidade dos itens.</p></div><CatalogAdminContent /></div>;
}
