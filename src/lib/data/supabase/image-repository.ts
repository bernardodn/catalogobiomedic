import type { SupabaseClient } from "@supabase/supabase-js";

import type { ImageRepository } from "@/lib/data/contracts";
import { optimizeCatalogImage } from "@/lib/data/demo/optimize-image";

const BUCKET = "catalog-images";

export class SupabaseImageRepository implements ImageRepository {
  constructor(private readonly client: SupabaseClient) {}

  async upload(itemId: string, file: File): Promise<string> {
    const image = await optimizeCatalogImage(file);
    const path = `catalog/${itemId}/${crypto.randomUUID()}.webp`;
    const { error } = await this.client.storage.from(BUCKET).upload(path, image, { contentType: "image/webp", upsert: false });
    if (error) throw error;
    return path;
  }

  async remove(path: string): Promise<void> {
    if (path.startsWith("/")) return;
    const { error } = await this.client.storage.from(BUCKET).remove([path]);
    if (error) throw error;
  }

  async getUrl(path: string | null): Promise<string | null> {
    if (!path || path.startsWith("/")) return path;
    return this.client.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }

  async clear(): Promise<void> {
    throw new Error("A restauração de dados existe apenas no modo demonstração.");
  }
}
