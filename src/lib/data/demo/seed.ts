import type { CatalogItem, CatalogItemType, Category } from "@/lib/domain/catalog";
import { slugify } from "@/lib/domain/slug";

const CREATED_AT = "2026-01-10T12:00:00.000Z";

function category(id: number, name: string): Category {
  return {
    id: `00000000-0000-4000-8000-${id.toString().padStart(12, "0")}`,
    name,
    slug: slugify(name),
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
  };
}

export const DEMO_CATEGORIES: Category[] = [
  category(1, "Vitaminas"),
  category(2, "Minerais"),
  category(3, "Metabolismo"),
  category(4, "Saúde intestinal"),
  category(5, "Esporte"),
  category(6, "Performance"),
  category(7, "Sono"),
  category(8, "Imunidade"),
  category(9, "Saúde feminina"),
  category(10, "Saúde masculina"),
  category(11, "Antioxidantes"),
  category(12, "Fitoterápicos"),
  category(13, "Outros"),
];

const categoryId = Object.fromEntries(
  DEMO_CATEGORIES.map(({ id, slug }) => [slug, id]),
) as Record<string, string>;

interface DemoItemDefinition {
  name: string;
  type: CatalogItemType;
  category: string;
  description: string;
  keywords: string[];
  active?: boolean;
}

function item(index: number, definition: DemoItemDefinition): CatalogItem {
  const createdAt = new Date(Date.UTC(2026, 0, 10 + index, 12)).toISOString();

  return {
    id: `10000000-0000-4000-8000-${index.toString().padStart(12, "0")}`,
    name: definition.name,
    slug: slugify(definition.name),
    type: definition.type,
    categoryId: categoryId[definition.category],
    shortDescription: definition.description,
    keywords: definition.keywords,
    imagePath: index <= 6 ? "/brand/catalog-placeholder.svg" : null,
    active: definition.active ?? true,
    createdAt,
    updatedAt: createdAt,
  };
}

export const DEMO_ITEMS: CatalogItem[] = [
  item(1, {
    name: "Berberina",
    type: "active",
    category: "metabolismo",
    description: "Ativo disponível para formulações manipuladas voltadas ao metabolismo.",
    keywords: ["metabolismo", "fitoterápico"],
  }),
  item(2, {
    name: "Coenzima Q10",
    type: "active",
    category: "antioxidantes",
    description: "Antioxidante disponível para formulações personalizadas.",
    keywords: ["coq10", "energia", "antioxidante"],
  }),
  item(3, {
    name: "Magnésio Bisglicinato",
    type: "active",
    category: "minerais",
    description: "Mineral disponível para formulações manipuladas.",
    keywords: ["magnésio", "sono", "relaxamento", "mineral"],
  }),
  item(4, {
    name: "Melatonina",
    type: "active",
    category: "sono",
    description: "Ativo disponível para formulações personalizadas relacionadas ao sono.",
    keywords: ["sono", "ritmo circadiano"],
  }),
  item(5, {
    name: "Vitamina D3",
    type: "active",
    category: "vitaminas",
    description: "Vitamina disponível para diferentes apresentações manipuladas.",
    keywords: ["vitamina d", "colecalciferol", "imunidade"],
  }),
  item(6, {
    name: "Creatina",
    type: "active",
    category: "performance",
    description: "Ativo disponível para formulações voltadas à rotina esportiva.",
    keywords: ["esporte", "força", "performance"],
  }),
  item(7, {
    name: "Ashwagandha",
    type: "active",
    category: "fitoterapicos",
    description: "Extrato vegetal disponível para formulações manipuladas.",
    keywords: ["withania somnifera", "adaptógeno"],
  }),
  item(8, {
    name: "Zinco Quelado",
    type: "active",
    category: "minerais",
    description: "Mineral quelado disponível para formulações personalizadas.",
    keywords: ["zinco", "mineral", "imunidade"],
  }),
  item(9, {
    name: "L-Glutamina",
    type: "active",
    category: "saude-intestinal",
    description: "Aminoácido disponível para formulações manipuladas.",
    keywords: ["glutamina", "aminoácido", "intestino"],
  }),
  item(10, {
    name: "N-Acetilcisteína",
    type: "active",
    category: "antioxidantes",
    description: "Ativo antioxidante disponível para formulações personalizadas.",
    keywords: ["nac", "cisteína", "antioxidante"],
  }),
  item(11, {
    name: "D-Manose",
    type: "active",
    category: "saude-feminina",
    description: "Ativo disponível para formulações voltadas à saúde feminina.",
    keywords: ["d-manose", "saúde feminina"],
  }),
  item(12, {
    name: "Saw Palmetto",
    type: "active",
    category: "saude-masculina",
    description: "Extrato vegetal disponível para formulações voltadas à saúde masculina.",
    keywords: ["serenoa repens", "fitoterápico"],
  }),
  item(13, {
    name: "Curcumina",
    type: "active",
    category: "fitoterapicos",
    description: "Ativo vegetal cadastrado para demonstração administrativa.",
    keywords: ["cúrcuma", "antioxidante"],
    active: false,
  }),
  item(14, {
    name: "Beta-Alanina",
    type: "active",
    category: "esporte",
    description: "Aminoácido disponível para formulações esportivas.",
    keywords: ["beta alanina", "esporte", "performance"],
  }),
  item(15, {
    name: "Complexo B",
    type: "product",
    category: "vitaminas",
    description: "Produto de demonstração com vitaminas do complexo B.",
    keywords: ["vitaminas b", "complexo vitamínico"],
  }),
  item(16, {
    name: "Probiótico 10 Bilhões",
    type: "product",
    category: "saude-intestinal",
    description: "Produto de demonstração para apresentações manipuladas.",
    keywords: ["probiótico", "microbiota", "intestino"],
  }),
  item(17, {
    name: "Fórmula Imunidade",
    type: "product",
    category: "imunidade",
    description: "Produto demonstrativo cadastrado na categoria Imunidade.",
    keywords: ["imunidade", "vitaminas", "minerais"],
  }),
  item(18, {
    name: "Recovery Performance",
    type: "product",
    category: "performance",
    description: "Produto demonstrativo para a categoria Performance.",
    keywords: ["recuperação", "esporte", "performance"],
  }),
];
