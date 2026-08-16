import type { CatalogSort } from "@/lib/domain/catalog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SortSelectProps {
  value: CatalogSort;
  onChange: (value: CatalogSort) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as CatalogSort)}>
      <SelectTrigger aria-label="Ordenar por" className="w-full rounded-sm sm:w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="name-asc">Nome A–Z</SelectItem>
        <SelectItem value="name-desc">Nome Z–A</SelectItem>
        <SelectItem value="recent">Mais recentes</SelectItem>
      </SelectContent>
    </Select>
  );
}
