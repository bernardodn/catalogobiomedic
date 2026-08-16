"use client";

import { Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { label: "Início", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Sobre a BioMedic", href: "/#sobre" },
  { label: "Contato", href: "/#contato" },
];

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menu">
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Navegação</SheetTitle>
        </SheetHeader>
        <nav aria-label="Navegação móvel" className="flex flex-col gap-1 px-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="border-b py-4 text-sm font-medium">
              {link.label}
            </Link>
          ))}
          <Link href="/admin" className="mt-5 text-sm text-muted-foreground">
            Área Administrativa
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
