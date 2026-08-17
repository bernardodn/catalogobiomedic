import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import type { CatalogItem, Category } from "@/lib/domain/catalog";

interface CatalogCardProps {
  item: CatalogItem;
  category: Category;
  imageUrl: string | null;
}

export function CatalogCard({ item, category, imageUrl }: CatalogCardProps) {
  const source = imageUrl ?? "/brand/catalog-placeholder.svg";

  return (
    <article data-testid="catalog-card" className="group h-full">
      <Card className="h-full gap-0 overflow-hidden border-border py-0 shadow-none transition-[border-color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/45">
        <div className="relative aspect-[8/5] overflow-hidden border-b bg-muted">
          <Image
            src={source}
            alt={`Apresentação de ${item.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            unoptimized={source.startsWith("blob:")}
          />
        </div>
        <CardContent className="flex flex-1 flex-col p-5">
          <div className="mb-4 flex items-center justify-end gap-3">
            <span className="text-xs font-medium text-muted-foreground">{category.name}</span>
          </div>
          <h3 className="text-lg font-semibold tracking-tight text-brand-navy">
            {item.name}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
            {item.shortDescription}
          </p>
          {item.keywords.length > 0 ? (
            <div className="mt-5 hidden flex-wrap gap-1.5 lg:flex" aria-label="Palavras-chave">
              {item.keywords.slice(0, 3).map((keyword) => (
                <span
                  key={keyword}
                  className="border-l border-primary/50 pl-2 text-[0.7rem] text-muted-foreground"
                >
                  {keyword}
                </span>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </article>
  );
}
