import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { CatalogItemType, Category } from "@/lib/domain/catalog";

interface CatalogFiltersProps {
  type: CatalogItemType | "all";
  categoryId: string | "all";
  categories: Category[];
  onTypeChange: (type: CatalogItemType | "all") => void;
  onCategoryChange: (categoryId: string | "all") => void;
}

const typeOptions = [
  { value: "all" as const, label: "Todos" },
  { value: "active" as const, label: "Ativos" },
  { value: "product" as const, label: "Produtos" },
];

function TypeButtons({
  value,
  onChange,
}: {
  value: CatalogItemType | "all";
  onChange: (value: CatalogItemType | "all") => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Filtrar por tipo">
      {typeOptions.map((option) => (
        <Button
          key={option.value}
          type="button"
          size="sm"
          variant={value === option.value ? "default" : "outline"}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className="rounded-sm"
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

function CategorySelect({
  value,
  categories,
  onChange,
}: {
  value: string;
  categories: Category[];
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label="Categoria" className="w-full rounded-sm sm:w-56">
        <SelectValue placeholder="Todas as categorias" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas as categorias</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function CatalogFilters(props: CatalogFiltersProps) {
  return (
    <>
      <div className="hidden items-center gap-3 md:flex">
        <TypeButtons value={props.type} onChange={props.onTypeChange} />
        <CategorySelect
          value={props.categoryId}
          categories={props.categories}
          onChange={props.onCategoryChange}
        />
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button type="button" variant="outline" className="rounded-sm md:hidden">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Filtros
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-xl">
          <SheetHeader>
            <SheetTitle>Filtros do catálogo</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 px-4 pb-6">
            <div>
              <p className="mb-3 text-sm font-medium">Tipo</p>
              <TypeButtons value={props.type} onChange={props.onTypeChange} />
            </div>
            <div>
              <p className="mb-3 text-sm font-medium">Categoria</p>
              <CategorySelect
                value={props.categoryId}
                categories={props.categories}
                onChange={props.onCategoryChange}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
