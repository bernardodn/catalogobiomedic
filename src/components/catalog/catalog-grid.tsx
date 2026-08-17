import type { CatalogItem, Category } from "@/lib/domain/catalog";
import { CatalogCard } from "./catalog-card";

interface CatalogGridProps {
  items: CatalogItem[];
  categories: Category[];
  imageUrls?: Record<string, string | null>;
}

export function CatalogGrid({ items, categories, imageUrls = {} }: CatalogGridProps) {
  const categoriesById = new Map(categories.map((category) => [category.id, category]));

  return (
    <div className="grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const category = categoriesById.get(item.categoryId);
        if (!category) return null;
        return (
          <div key={item.id}>
            <CatalogCard
              item={item}
              category={category}
              imageUrl={imageUrls[item.id] ?? null}
            />
          </div>
        );
      })}
    </div>
  );
}
