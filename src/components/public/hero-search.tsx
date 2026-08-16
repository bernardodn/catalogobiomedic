"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = value.trim();
    router.push(query ? `/catalogo?q=${encodeURIComponent(query)}` : "/catalogo");
  }

  return (
    <form
      role="search"
      onSubmit={submit}
      className="mx-auto flex max-w-3xl flex-col gap-3 border border-primary/35 bg-background p-2 shadow-[0_18px_50px_rgba(8,47,72,0.09)] sm:flex-row"
    >
      <label htmlFor="hero-search" className="sr-only">
        Pesquisar no catálogo
      </label>
      <div className="relative flex-1">
        <Search
          aria-hidden="true"
          className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-primary"
        />
        <Input
          id="hero-search"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Pesquise por ativo, produto ou categoria..."
          className="h-13 rounded-sm border-0 bg-transparent pl-12 text-base shadow-none focus-visible:ring-0"
        />
      </div>
      <Button type="submit" size="lg" className="h-13 rounded-sm px-7">
        Pesquisar
      </Button>
    </form>
  );
}
