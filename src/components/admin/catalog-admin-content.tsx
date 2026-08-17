"use client";

import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { useCatalogAdmin } from "@/features/catalog/use-catalog-admin";
import type { CatalogItem } from "@/lib/domain/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function CatalogAdminContent() {
  const { state, setActive, remove, retry } = useCatalogAdmin();
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState<CatalogItem | null>(null);
  const categories = useMemo(() => new Map(state.categories.map((category) => [category.id, category.name])), [state.categories]);
  const items = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    if (!normalized) return state.items;
    return state.items.filter((item) => `${item.name} ${categories.get(item.categoryId) ?? ""}`.toLocaleLowerCase("pt-BR").includes(normalized));
  }, [categories, query, state.items]);

  async function toggle(item: CatalogItem, active: boolean) {
    try {
      await setActive(item.id, active);
      toast.success(active ? "Item ativado." : "Item desativado.");
    } catch {
      toast.error("Não foi possível alterar o status.");
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await remove(pendingDelete.id);
      toast.success("Item excluído.");
      setPendingDelete(null);
    } catch {
      toast.error("Não foi possível excluir o item.");
    }
  }

  if (state.status === "loading") {
    return <div aria-label="Carregando catálogo" className="space-y-3"><Skeleton className="h-11 w-full rounded-sm" /><Skeleton className="h-96 w-full rounded-sm" /></div>;
  }

  if (state.status === "error") {
    return <div className="border bg-card p-10 text-center"><p className="text-sm text-muted-foreground">{state.error}</p><Button onClick={() => void retry()} variant="outline" className="mt-5 rounded-sm">Tentar novamente</Button></div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-lg flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome ou categoria" aria-label="Buscar no catálogo administrativo" className="pl-9" />
        </div>
        <Button asChild className="rounded-sm"><Link href="/admin/catalogo/novo"><Plus aria-hidden="true" />Novo item</Link></Button>
      </div>

      <div className="hidden overflow-hidden border bg-card md:block">
        <Table>
          <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Categoria</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
          <TableBody>
            {items.map((item) => {
              const busy = state.busyIds.includes(item.id);
              return (
                <TableRow key={item.id}>
                  <TableCell><div className="font-medium">{item.name}</div><div className="mt-1 max-w-md truncate text-xs text-muted-foreground">{item.shortDescription}</div></TableCell>
                  <TableCell>{categories.get(item.categoryId) ?? "—"}</TableCell>
                  <TableCell><div className="flex items-center gap-2"><Switch checked={item.active} disabled={busy} onCheckedChange={(active) => void toggle(item, active)} aria-label={`${item.active ? "Desativar" : "Ativar"} ${item.name}`} /><span className="text-xs text-muted-foreground">{item.active ? "Visível" : "Oculto"}</span></div></TableCell>
                  <TableCell><div className="flex justify-end gap-1"><Button asChild variant="ghost" size="icon"><Link href={`/admin/catalogo/${item.id}/editar`} aria-label={`Editar ${item.name}`}><Pencil aria-hidden="true" /></Link></Button><Button variant="ghost" size="icon" aria-label={`Excluir ${item.name}`} onClick={() => setPendingDelete(item)}><Trash2 aria-hidden="true" /></Button></div></TableCell>
                </TableRow>
              );
            })}
            {items.length === 0 && <TableRow><TableCell colSpan={4} className="h-32 text-center text-muted-foreground">Nenhum item encontrado.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
      <div className="divide-y border bg-card md:hidden">
        {items.map((item) => {
          const busy = state.busyIds.includes(item.id);
          return (
            <article key={item.id} data-testid={`mobile-admin-item-${item.name}`} className="space-y-4 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-medium text-brand-navy">{item.name}</h2>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{item.shortDescription}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 border-t pt-3">
                <div>
                  <p className="text-xs font-medium">{categories.get(item.categoryId) ?? "—"}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Switch checked={item.active} disabled={busy} onCheckedChange={(active) => void toggle(item, active)} aria-label={`${item.active ? "Desativar" : "Ativar"} ${item.name}`} />
                    <span className="text-xs text-muted-foreground">{item.active ? "Visível" : "Oculto"}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button asChild variant="outline" size="icon"><Link href={`/admin/catalogo/${item.id}/editar`} aria-label={`Editar ${item.name}`}><Pencil aria-hidden="true" /></Link></Button>
                  <Button variant="outline" size="icon" aria-label={`Excluir ${item.name}`} onClick={() => setPendingDelete(item)}><Trash2 aria-hidden="true" /></Button>
                </div>
              </div>
            </article>
          );
        })}
        {items.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">Nenhum item encontrado.</p>}
      </div>
      <p className="text-xs text-muted-foreground">{items.length} de {state.total} itens</p>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Excluir {pendingDelete?.name}?</AlertDialogTitle><AlertDialogDescription>Esta ação remove o item do catálogo e não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => void confirmDelete()}>Excluir definitivamente</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
