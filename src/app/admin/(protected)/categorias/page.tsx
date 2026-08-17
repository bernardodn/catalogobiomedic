import type { Metadata } from "next";
import { CategoryAdminContent } from "@/components/admin/category-admin-content";

export const metadata: Metadata = { title: "Categorias" };

export default function CategoriesPage() {
  return <div className="mx-auto max-w-6xl space-y-7"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Organização</p><h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Categorias</h1><p className="mt-2 text-sm text-muted-foreground">Organize os itens apresentados no catálogo.</p></div><CategoryAdminContent /></div>;
}
