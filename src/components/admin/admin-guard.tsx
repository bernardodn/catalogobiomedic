"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAdminSession } from "@/features/auth/use-admin-session";

export function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status } = useAdminSession();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/admin/login");
  }, [router, status]);

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center" aria-label="Verificando acesso">
        <LoaderCircle className="size-6 animate-spin text-primary" aria-hidden="true" />
      </div>
    );
  }

  return children;
}
