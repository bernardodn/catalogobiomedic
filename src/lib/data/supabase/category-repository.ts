import type { SupabaseClient } from "@supabase/supabase-js";

import type { CategoryRepository } from "@/lib/data/contracts";
import type { Category } from "@/lib/domain/catalog";
import { slugify } from "@/lib/domain/slug";
import { ConflictError, NotFoundError } from "@/lib/data/errors";
import { mapCategory, type CategoryRow } from "./mappers";

function mapWriteError(error: { code?: string; message: string }): never {
  if (error.code === "23503") throw new ConflictError("A categoria possui itens vinculados.");
  if (error.code === "23505") throw new ConflictError("Já existe uma categoria com esse nome.");
  throw error;
}

export class SupabaseCategoryRepository implements CategoryRepository {
  constructor(private readonly client: SupabaseClient) {}

  async list(): Promise<Category[]> {
    const { data, error } = await this.client.from("categories").select("*").order("name");
    if (error) throw error;
    return ((data ?? []) as unknown as CategoryRow[]).map(mapCategory);
  }

  async create(input: { name: string }): Promise<Category> {
    const { data, error } = await this.client.from("categories").insert({ name: input.name, slug: slugify(input.name) }).select("*").single();
    if (error) mapWriteError(error);
    return mapCategory(data as unknown as CategoryRow);
  }

  async update(id: string, input: { name: string }): Promise<Category> {
    const { data, error } = await this.client.from("categories").update({ name: input.name, slug: slugify(input.name) }).eq("id", id).select("*").maybeSingle();
    if (error) mapWriteError(error);
    if (!data) throw new NotFoundError("Categoria não encontrada.");
    return mapCategory(data as unknown as CategoryRow);
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.client.from("categories").delete().eq("id", id);
    if (error) mapWriteError(error);
  }
}
