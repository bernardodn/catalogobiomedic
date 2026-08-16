import type { CatalogItem, CatalogItemInput } from "@/lib/domain/catalog";
import type { Repositories } from "@/lib/data/contracts";

interface SaveCatalogItemOptions {
  repositories: Repositories;
  input: CatalogItemInput;
  current?: CatalogItem;
  file?: File | null;
  removeImage?: boolean;
}

interface SaveCatalogItemResult {
  item: CatalogItem;
  warning: string | null;
}

export async function saveCatalogItem({
  repositories,
  input,
  current,
  file,
  removeImage = false,
}: SaveCatalogItemOptions): Promise<SaveCatalogItemResult> {
  if (!current) {
    const created = await repositories.catalog.create({ ...input, imagePath: null });
    if (!file) return { item: created, warning: null };

    try {
      const imagePath = await repositories.images.upload(created.id, file);
      const item = await repositories.catalog.update(created.id, { ...created, imagePath });
      return { item, warning: null };
    } catch {
      return {
        item: created,
        warning: "O item foi salvo, mas não foi possível enviar a imagem.",
      };
    }
  }

  if (file) {
    const newPath = await repositories.images.upload(current.id, file);
    try {
      const item = await repositories.catalog.update(current.id, {
        ...input,
        imagePath: newPath,
      });
      if (current.imagePath && current.imagePath !== newPath) {
        await repositories.images.remove(current.imagePath);
      }
      return { item, warning: null };
    } catch (error) {
      await repositories.images.remove(newPath);
      throw error;
    }
  }

  const imagePath = removeImage ? null : input.imagePath;
  const item = await repositories.catalog.update(current.id, { ...input, imagePath });
  if (removeImage && current.imagePath) {
    await repositories.images.remove(current.imagePath);
  }
  return { item, warning: null };
}
