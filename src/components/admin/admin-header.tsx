"use client";

import { LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAdminSession } from "@/features/auth/use-admin-session";
import { AdminSidebar } from "./admin-sidebar";

export function AdminHeader() {
  const router = useRouter();
  const { session, logout } = useAdminSession();

  async function signOut() {
    await logout();
    router.replace("/admin/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur-sm sm:px-7 lg:ml-64">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Abrir navegação administrativa" className="lg:hidden">
            <Menu className="size-5" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 border-0 bg-sidebar p-0">
          <SheetTitle className="sr-only">Navegação administrativa</SheetTitle>
          <AdminSidebar mobile />
        </SheetContent>
      </Sheet>
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden text-sm text-muted-foreground sm:inline">
          {session?.name ?? "Administrador"}
        </span>
        <Button variant="ghost" size="sm" onClick={() => void signOut()}>
          <LogOut className="size-4" aria-hidden="true" />
          Sair
        </Button>
      </div>
    </header>
  );
}
