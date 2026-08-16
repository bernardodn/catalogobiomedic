import { DashboardContent } from "@/components/admin/dashboard-content";

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="text-sm text-primary">Painel administrativo</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-navy">
          Visão geral
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Acompanhe os principais números e as últimas inclusões do catálogo.
        </p>
      </div>
      <DashboardContent />
    </div>
  );
}
