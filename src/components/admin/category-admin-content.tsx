"use client";

import { Pencil, RotateCcw, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { resetDemoData } from "@/features/admin/reset-demo-data";
import { DEFAULT_QUERY, type CatalogItem, type Category } from "@/lib/domain/catalog";
import { categorySchema } from "@/lib/domain/schemas";
import { DataError } from "@/lib/data/errors";
import { useRepositories } from "@/lib/data/use-repositories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
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

interface CategoryData {
  categories: Category[];
  items: CatalogItem[];
}

export function CategoryAdminContent() {
  const repositories = useRepositories();
  const [data, setData] = useState<CategoryData | null>(null);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const [showReset, setShowReset] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [categories, page] = await Promise.all([
      repositories.categories.list(),
      repositories.catalog.listAdmin({ ...DEFAULT_QUERY, limit: 100 }),
    ]);
    setData({ categories, items: page.items });
  }, [repositories]);

  useEffect(() => {
    let active = true;
    void Promise.all([
      repositories.categories.list(),
      repositories.catalog.listAdmin({ ...DEFAULT_QUERY, limit: 100 }),
    ]).then(([categories, page]) => {
      if (active) setData({ categories, items: page.items });
    });
    return () => { active = false; };
  }, [repositories]);

  const itemCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of data?.items ?? []) counts.set(item.categoryId, (counts.get(item.categoryId) ?? 0) + 1);
    return counts;
  }, [data?.items]);

  function messageFrom(error: unknown) {
    return error instanceof DataError ? error.message : "Não foi possível concluir a operação.";
  }

  async function submit() {
    const parsed = categorySchema.safeParse({ name });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Revise o nome.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (editing) await repositories.categories.update(editing.id, parsed.data);
      else await repositories.categories.create(parsed.data);
      toast.success(editing ? "Categoria atualizada." : "Categoria adicionada.");
      setEditing(null);
      setName("");
      await load();
    } catch (caught) {
      setError(messageFrom(caught));
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setBusy(true);
    setError(null);
    try {
      await repositories.categories.remove(pendingDelete.id);
      toast.success("Categoria excluída.");
      setPendingDelete(null);
      await load();
    } catch (caught) {
      setPendingDelete(null);
      setError(messageFrom(caught));
    } finally {
      setBusy(false);
    }
  }

  async function confirmReset() {
    setBusy(true);
    try {
      await resetDemoData(repositories);
      await load();
      setEditing(null);
      setName("");
      setError(null);
      setShowReset(false);
      toast.success("Dados de demonstração restaurados.");
    } finally {
      setBusy(false);
    }
  }

  if (!data) return <div aria-label="Carregando categorias" className="space-y-3"><Skeleton className="h-36 rounded-sm" /><Skeleton className="h-96 rounded-sm" /></div>;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="border bg-card">
        <div className="border-b px-5 py-4"><h2 className="font-semibold">Categorias cadastradas</h2><p className="mt-1 text-xs text-muted-foreground">{data.categories.length} categorias no catálogo</p></div>
        <ul className="divide-y">
          {data.categories.map((category) => (
            <li key={category.id} className="flex items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{category.name}</p><p className="mt-1 text-xs text-muted-foreground">{itemCounts.get(category.id) ?? 0} itens vinculados</p></div>
              <Button variant="ghost" size="icon" aria-label={`Editar ${category.name}`} onClick={() => { setEditing(category); setName(category.name); setError(null); }}><Pencil aria-hidden="true" /></Button>
              <Button variant="ghost" size="icon" aria-label={`Excluir ${category.name}`} onClick={() => setPendingDelete(category)}><Trash2 aria-hidden="true" /></Button>
            </li>
          ))}
        </ul>
      </section>

      <div className="space-y-6">
        <section className="border bg-card p-5">
          <div className="flex items-center justify-between"><h2 className="font-semibold">{editing ? "Editar categoria" : "Nova categoria"}</h2>{editing && <Button variant="ghost" size="icon" aria-label="Cancelar edição" onClick={() => { setEditing(null); setName(""); setError(null); }}><X aria-hidden="true" /></Button>}</div>
          <div className="mt-5 space-y-2"><Label htmlFor="category-name">Nome da categoria</Label><Input id="category-name" value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void submit(); }} aria-invalid={Boolean(error)} />{error && <p className="text-sm text-destructive">{error}</p>}</div>
          <Button className="mt-5 w-full rounded-sm" disabled={busy} onClick={() => void submit()}>{editing ? "Salvar alterações" : "Adicionar categoria"}</Button>
        </section>

        <section className="border border-destructive/30 bg-card p-5">
          <h2 className="font-semibold">Dados de demonstração</h2>
          <p className="mt-2 text-sm text-muted-foreground">Restaura os 18 itens e as 13 categorias iniciais. Sua sessão continuará conectada.</p>
          <Button variant="outline" className="mt-5 w-full rounded-sm text-destructive" onClick={() => setShowReset(true)}><RotateCcw aria-hidden="true" />Restaurar demonstração</Button>
        </section>
      </div>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Excluir {pendingDelete?.name}?</AlertDialogTitle><AlertDialogDescription>A exclusão só será permitida se não houver itens vinculados.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => void confirmDelete()}>Excluir categoria</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showReset} onOpenChange={setShowReset}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Restaurar dados iniciais?</AlertDialogTitle><AlertDialogDescription>Cadastros e imagens adicionados neste navegador serão removidos.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => void confirmReset()}>Restaurar dados</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
