import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata: Metadata = {
  title: { default: "Painel BioMedic", template: "%s | BioMedic" },
  robots: { index: false, follow: false },
};

export default function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-muted/45">
        <AdminSidebar />
        <AdminHeader />
        <main className="p-4 sm:p-7 lg:ml-64">{children}</main>
      </div>
    </AdminGuard>
  );
}
