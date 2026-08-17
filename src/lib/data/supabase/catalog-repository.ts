import type { SupabaseClient } from "@supabase/supabase-js";

import type { CatalogRepository } from "@/lib/data/contracts";
import type { CatalogItem, CatalogItemInput, CatalogPage, CatalogQuery, CatalogStats } from "@/lib/domain/catalog";
import { slugify } from "@/lib/domain/slug";
import { NotFoundError } from "@/lib/data/errors";
import { mapCatalogItem, type CatalogRow } from "./mappers";

type CatalogRpcRow = CatalogRow & { total_count: number | string };

function rowInput(input: CatalogItemInput) {
  return {
    name: input.name,
    slug: slugify(input.name),
    category_id: input.categoryId,
    short_description: input.shortDescription,
    keywords: input.keywords,
    image_path: input.imagePath,
    active: input.active,
  };
}

export class SupabaseCatalogRepository implements CatalogRepository {
  constructor(private readonly client: SupabaseClient) {}

  listPublic(query: CatalogQuery) { return this.list(query, false); }
  listAdmin(query: CatalogQuery) { return this.list(query, true); }

  private async list(query: CatalogQuery, includeInactive: boolean): Promise<CatalogPage> {
    const { data, error } = await this.client.rpc("search_catalog_items", {
      p_query: query.q,
      p_category_id: query.categoryId === "all" ? null : query.categoryId,
      p_sort: query.sort,
      p_offset: query.cursor,
      p_limit: query.limit,
      p_include_inactive: includeInactive,
    });
    if (error) throw error;
    const rows = (data ?? []) as unknown as CatalogRpcRow[];
    const total = rows.length ? Number(rows[0].total_count) : 0;
    const nextCursor = query.cursor + rows.length < total ? query.cursor + rows.length : null;
    return { items: rows.map(mapCatalogItem), total, nextCursor };
  }

  async getStats(): Promise<CatalogStats> {
    const count = async (column?: "active", value?: boolean) => {
      let query = this.client.from("catalog_items").select("id", { count: "exact", head: true });
      if (column) query = query.eq(column, value!);
      const { count: result, error } = await query;
      if (error) throw error;
      return result ?? 0;
    };
    const [total, enabled] = await Promise.all([
      count(), count("active", true),
    ]);
    return { total, enabled };
  }

  async listRecent(limit: number): Promise<CatalogItem[]> {
    const { data, error } = await this.client.from("catalog_items").select("*").order("created_at", { ascending: false }).limit(Math.max(0, limit));
    if (error) throw error;
    return ((data ?? []) as unknown as CatalogRow[]).map(mapCatalogItem);
  }

  async getById(id: string): Promise<CatalogItem | null> {
    const { data, error } = await this.client.from("catalog_items").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? mapCatalogItem(data as unknown as CatalogRow) : null;
  }

  async create(input: CatalogItemInput): Promise<CatalogItem> {
    const { data, error } = await this.client.from("catalog_items").insert(rowInput(input)).select("*").single();
    if (error) throw error;
    return mapCatalogItem(data as unknown as CatalogRow);
  }

  async update(id: string, input: CatalogItemInput): Promise<CatalogItem> {
    const { data, error } = await this.client.from("catalog_items").update(rowInput(input)).eq("id", id).select("*").maybeSingle();
    if (error) throw error;
    if (!data) throw new NotFoundError("Item não encontrado.");
    return mapCatalogItem(data as unknown as CatalogRow);
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.client.from("catalog_items").delete().eq("id", id);
    if (error) throw error;
  }

  async setActive(id: string, active: boolean): Promise<CatalogItem> {
    const { data, error } = await this.client.from("catalog_items").update({ active }).eq("id", id).select("*").maybeSingle();
    if (error) throw error;
    if (!data) throw new NotFoundError("Item não encontrado.");
    return mapCatalogItem(data as unknown as CatalogRow);
  }
}
