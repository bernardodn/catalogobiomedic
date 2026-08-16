"use client";

import { FolderKanban, LayoutDashboard, Tags } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { DemoModeNotice } from "./demo-mode-notice";

export const adminLinks = [
  { label: "Visão geral", href: "/admin", icon: LayoutDashboard },
  { label: "Catálogo", href: "/admin/catalogo", icon: FolderKanban },
  { label: "Categorias", href: "/admin/categorias", icon: Tags },
];

export function AdminSidebar({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-sidebar text-sidebar-foreground",
        mobile ? "min-h-[calc(100vh-2rem)]" : "fixed inset-y-0 left-0 hidden w-64 lg:flex",
      )}
    >
      <Link href="/" className="border-b border-sidebar-border px-6 py-5">
        <Image
          src="/brand/biomedic-logo.png"
          alt="BioMedic Farmácia de Manipulação"
          width={168}
          height={47}
          className="brightness-0 invert"
        />
      </Link>
      <nav aria-label="Administração" className="flex-1 space-y-1 px-4 py-6">
        {adminLinks.map(({ label, href, icon: Icon }) => {
          const selected = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={selected ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                selected
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4">
        <DemoModeNotice />
      </div>
    </aside>
  );
}
