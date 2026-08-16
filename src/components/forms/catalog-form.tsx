"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { saveCatalogItem } from "@/features/catalog/save-catalog-item";
import type { CatalogItem, Category } from "@/lib/domain/catalog";
import { catalogItemSchema, type CatalogItemFormValues } from "@/lib/domain/schemas";
import { useRepositories } from "@/lib/data/use-repositories";
import { cn } from "@/lib/utils";

interface CatalogFormProps {
  categories: Category[];
  mode: "create" | "edit";
  initialItem?: CatalogItem;
  initialImageUrl?: string | null;
}

export function CatalogForm({
  categories,
  mode,
  initialItem,
  initialImageUrl = null,
}: CatalogFormProps) {
  const repositories = useRepositories();
  const router = useRouter();
  const [keywordDraft, setKeywordDraft] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const form = useForm<CatalogItemFormValues>({
    resolver: zodResolver(catalogItemSchema),
    defaultValues: initialItem
      ? {
          name: initialItem.name,
          type: initialItem.type,
          categoryId: initialItem.categoryId,
          shortDescription: initialItem.shortDescription,
          keywords: initialItem.keywords,
          imagePath: initialItem.imagePath,
          active: initialItem.active,
        }
      : {
          name: "",
          type: "active",
          categoryId: categories[0]?.id ?? "",
          shortDescription: "",
          keywords: [],
          imagePath: null,
          active: true,
        },
  });

  const keywords = useWatch({ control: form.control, name: "keywords" });
  const description = useWatch({ control: form.control, name: "shortDescription" });
  const selectedPreviewUrl = useMemo(() => file ? URL.createObjectURL(file) : null, [file]);
  const previewUrl = selectedPreviewUrl ?? (removeImage ? null : initialImageUrl);

  useEffect(() => {
    return () => {
      if (selectedPreviewUrl) URL.revokeObjectURL(selectedPreviewUrl);
    };
  }, [selectedPreviewUrl]);

  function addKeyword() {
    const value = keywordDraft.trim().replace(/,$/, "");
    if (!value) return;
    if (!keywords.some((keyword) => keyword.toLocaleLowerCase("pt-BR") === value.toLocaleLowerCase("pt-BR"))) {
      form.setValue("keywords", [...keywords, value], { shouldValidate: true });
    }
    setKeywordDraft("");
  }

  function clearImage() {
    setFile(null);
    setRemoveImage(Boolean(initialItem?.imagePath));
  }

  async function onSubmit(values: CatalogItemFormValues) {
    try {
      const result = await saveCatalogItem({
        repositories,
        current: initialItem,
        input: values,
        file,
        removeImage,
      });
      if (result.warning) toast.warning(result.warning);
      else toast.success(mode === "create" ? "Item cadastrado." : "Item atualizado.");
      if (mode === "create") router.push("/admin/catalogo");
      else router.refresh();
    } catch {
      toast.error("Não foi possível salvar o item. Revise os dados e tente novamente.");
    }
  }

  const error = (name: keyof CatalogItemFormValues) => form.formState.errors[name]?.message;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <section className="grid gap-6 border bg-card p-5 sm:p-7 lg:grid-cols-2">
        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" {...form.register("name")} aria-invalid={Boolean(error("name"))} />
          {error("name") && <p className="text-sm text-destructive">{error("name")}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <select id="type" {...form.register("type")} className="h-10 w-full border bg-background px-3 text-sm">
            <option value="active">Ativo</option>
            <option value="product">Produto</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Categoria</Label>
          <select id="categoryId" {...form.register("categoryId")} className="h-10 w-full border bg-background px-3 text-sm">
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          {error("categoryId") && <p className="text-sm text-destructive">{error("categoryId")}</p>}
        </div>

        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="shortDescription">Descrição curta</Label>
          <Textarea id="shortDescription" rows={4} {...form.register("shortDescription")} aria-invalid={Boolean(error("shortDescription"))} />
          <div className="flex justify-between gap-4 text-xs text-muted-foreground">
            <span className="text-destructive">{error("shortDescription")}</span>
            <span>{description.length}/320</span>
          </div>
        </div>

        <div className="space-y-3 lg:col-span-2">
          <Label htmlFor="keywords">Palavras-chave</Label>
          <Input
            id="keywords"
            value={keywordDraft}
            onChange={(event) => setKeywordDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === ",") {
                event.preventDefault();
                addKeyword();
              }
            }}
            placeholder="Digite e pressione Enter"
          />
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <span key={keyword} className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 text-xs">
                  {keyword}
                  <button
                    type="button"
                    aria-label={`Remover ${keyword}`}
                    onClick={() => form.setValue("keywords", keywords.filter((value) => value !== keyword))}
                  >
                    <X className="size-3" aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
          )}
          {error("keywords") && <p className="text-sm text-destructive">{error("keywords")}</p>}
        </div>
      </section>

      <section className="grid gap-6 border bg-card p-5 sm:p-7 lg:grid-cols-[220px_1fr]">
        <div className={cn("flex aspect-square items-center justify-center border bg-muted/50", previewUrl && "bg-white")}>
          {previewUrl ? (
            // Blob URLs and demo paths are both intentionally rendered by the browser.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="Prévia do item" className="size-full object-contain p-4" />
          ) : <ImagePlus className="size-9 text-muted-foreground" aria-hidden="true" />}
        </div>
        <div className="flex flex-col justify-center gap-4">
          <div>
            <h2 className="text-base font-semibold">Imagem do catálogo</h2>
            <p className="mt-1 text-sm text-muted-foreground">PNG, JPEG ou WebP de até 5 MB. A imagem será otimizada automaticamente.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" className="relative rounded-sm">
              Selecionar imagem
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                aria-label="Selecionar imagem"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={(event) => {
                  const selected = event.target.files?.[0] ?? null;
                  setFile(selected);
                  setRemoveImage(false);
                }}
              />
            </Button>
            {previewUrl && <Button type="button" variant="ghost" onClick={clearImage}>Remover imagem</Button>}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-5 border bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <Controller
          name="active"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <Switch id="active" checked={field.value} onCheckedChange={field.onChange} />
              <div>
                <Label htmlFor="active">Item ativo</Label>
                <p className="text-xs text-muted-foreground">Exibe o item no catálogo público.</p>
              </div>
            </div>
          )}
        />
        <div className="flex gap-3">
          <Button type="button" variant="outline" className="rounded-sm" onClick={() => router.push("/admin/catalogo")}>Cancelar</Button>
          <Button type="submit" className="rounded-sm" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="animate-spin" aria-hidden="true" />}
            Salvar item
          </Button>
        </div>
      </section>
    </form>
  );
}
