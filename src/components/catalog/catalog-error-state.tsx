import { CircleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CatalogErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="border border-destructive/25 px-6 py-14 text-center">
      <CircleAlert className="mx-auto size-8 text-destructive" aria-hidden="true" />
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
      <Button type="button" variant="outline" onClick={onRetry} className="mt-6 rounded-sm">
        Tentar novamente
      </Button>
    </div>
  );
}
