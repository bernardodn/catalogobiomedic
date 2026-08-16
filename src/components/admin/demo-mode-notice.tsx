import { FlaskConical } from "lucide-react";

import { resolveDataMode } from "@/lib/config/env";

export function DemoModeNotice() {
  if (resolveDataMode() !== "demo") return null;
  return (
    <div className="border border-sidebar-border p-3 text-xs leading-5 text-sidebar-foreground/70">
      <FlaskConical className="mb-2 size-4 text-sidebar-primary" aria-hidden="true" />
      <strong className="block text-sidebar-foreground">Modo demonstração</strong>
      Dados salvos neste navegador.
    </div>
  );
}
