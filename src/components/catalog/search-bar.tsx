import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <label htmlFor="catalog-search" className="sr-only">
        Pesquisar no catálogo
      </label>
      <Search
        aria-hidden="true"
        className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-primary"
      />
      <Input
        id="catalog-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
          placeholder="Pesquise por nome, categoria ou palavra-chave..."
        className="h-14 rounded-sm border-primary/35 bg-background pl-12 pr-12 text-base shadow-none"
      />
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Limpar pesquisa"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      ) : null}
    </div>
  );
}
