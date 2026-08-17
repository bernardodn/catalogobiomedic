import { Suspense } from "react";

import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { CatalogSkeleton } from "@/components/catalog/catalog-skeleton";
import { PharmaceuticalFormsSection } from "@/components/catalog/pharmaceutical-forms-section";

export const metadata = {
  title: "Catálogo BioMedic | Itens para Manipulação",
  description: "Encontre itens disponíveis para manipulação na BioMedic.",
};

export default function CatalogPage() {
  return (
    <section className="py-14 sm:py-20">
      <div className="page-container">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-primary">Consulta rápida</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-brand-navy sm:text-5xl">
            Catálogo BioMedic
          </h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            Encontre rapidamente itens disponíveis para manipulação.
          </p>
        </div>
        <div className="mt-10">
          <PharmaceuticalFormsSection />
        </div>
        <div className="mt-10">
          <Suspense fallback={<CatalogSkeleton />}>
            <CatalogBrowser />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
