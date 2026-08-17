import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { Category } from "@/lib/domain/catalog";

interface CatalogFiltersProps {
  categoryId: string | "all";
  categories: Category[];
  onCategoryChange: (categoryId: string | "all") => void;
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
