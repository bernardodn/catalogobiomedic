import Image from "next/image";
import Link from "next/link";

import { MobileNav } from "./mobile-nav";

const links = [
  { label: "Início", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Sobre a BioMedic", href: "/#sobre" },
  { label: "Contato", href: "/#contato" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
      <div className="page-container flex h-20 items-center justify-between gap-8">
        <Link href="/" aria-label="BioMedic — Início" className="shrink-0">
          <Image
            src="/brand/biomedic-logo.png"
            alt="BioMedic Farmácia de Manipulação"
            width={178}
            height={50}
            priority
          />
        </Link>
        <nav aria-label="Navegação principal" className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Link
            href="/admin"
            className="text-xs font-medium text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
          >
            Área Administrativa
          </Link>
        </div>
        <MobileNav />
      </div>
    </header>
  );
}
