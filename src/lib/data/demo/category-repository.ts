import type { CategoryRepository } from "@/lib/data/contracts";
import { ConflictError, NotFoundError } from "@/lib/data/errors";
import type { Category } from "@/lib/domain/catalog";
import { categorySchema } from "@/lib/domain/schemas";
import { normalizeText } from "@/lib/domain/search";
import { slugify } from "@/lib/domain/slug";
import { readDemoDatabase, writeDemoDatabase } from "./database";

export class DemoCategoryRepository implements CategoryRepository {
  async list(): Promise<Category[]> {
    return readDemoDatabase().categories.sort((first, second) =>
      first.name.localeCompare(second.name, "pt-BR", { sensitivity: "base" }),
    );
  }

  async create(input: { name: string }): Promise<Category> {
    const { name } = categorySchema.parse(input);
    const database = readDemoDatabase();
    this.assertUniqueName(name, database.categories);
    const timestamp = new Date().toISOString();
    const created: Category = {
      id: crypto.randomUUID(),
      name,
      slug: slugify(name),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    database.categories.push(created);
    writeDemoDatabase(database);
    return structuredClone(created);
  }

  async update(id: string, input: { name: string }): Promise<Category> {
    const { name } = categorySchema.parse(input);
    const database = readDemoDatabase();
    const index = database.categories.findIndex((category) => category.id === id);
    if (index < 0) throw new NotFoundError("Categoria não encontrada.");
    this.assertUniqueName(name, database.categories, id);

    const updated = {
      ...database.categories[index],
      name,
      slug: slugify(name),
      updatedAt: new Date().toISOString(),
    };
    database.categories[index] = updated;
    writeDemoDatabase(database);
    return structuredClone(updated);
  }

  async remove(id: string): Promise<void> {
    const database = readDemoDatabase();
    const index = database.categories.findIndex((category) => category.id === id);
    if (index < 0) throw new NotFoundError("Categoria não encontrada.");
    if (database.items.some(({ categoryId }) => categoryId === id)) {
      throw new ConflictError("A categoria possui itens vinculados.");
    }
    database.categories.splice(index, 1);
    writeDemoDatabase(database);
  }

  private assertUniqueName(
    name: string,
    categories: Category[],
    currentId?: string,
  ): void {
    const normalized = normalizeText(name);
    if (
      categories.some(
        (category) =>
          category.id !== currentId && normalizeText(category.name) === normalized,
      )
    ) {
      throw new ConflictError("Já existe uma categoria com esse nome.");
    }
  }
}
