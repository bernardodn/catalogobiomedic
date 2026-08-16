import { CatalogSkeleton } from "@/components/catalog/catalog-skeleton";

export default function CatalogLoading() {
  return (
    <section className="py-20">
      <div className="page-container">
        <CatalogSkeleton />
      </div>
    </section>
  );
}
