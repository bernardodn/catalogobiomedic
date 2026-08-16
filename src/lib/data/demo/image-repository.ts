import type { ImageRepository } from "@/lib/data/contracts";
import { optimizeCatalogImage } from "./optimize-image";

const DATABASE_NAME = "biomedic-demo";
const STORE_NAME = "catalog-images";

type ImageOptimizer = (file: File) => Promise<Blob>;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function writeBlob(path: string, blob: Blob): Promise<void> {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(blob, path);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

async function readBlob(path: string): Promise<Blob | null> {
  const database = await openDatabase();
  const result = await new Promise<Blob | undefined>((resolve, reject) => {
    const request = database.transaction(STORE_NAME).objectStore(STORE_NAME).get(path);
    request.onsuccess = () => resolve(request.result as Blob | undefined);
    request.onerror = () => reject(request.error);
  });
  database.close();
  return result ?? null;
}

async function deleteBlob(path: string): Promise<void> {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(path);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

async function clearBlobs(): Promise<void> {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).clear();
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

export class DemoImageRepository implements ImageRepository {
  private readonly objectUrls = new Map<string, string>();

  constructor(private readonly optimize: ImageOptimizer = optimizeCatalogImage) {}

  async upload(itemId: string, file: File): Promise<string> {
    const optimized = await this.optimize(file);
    const path = `catalog/${itemId}/${crypto.randomUUID()}.webp`;
    await writeBlob(path, optimized);
    return path;
  }

  async remove(path: string): Promise<void> {
    if (path.startsWith("/")) return;
    this.revoke(path);
    await deleteBlob(path);
  }

  async getUrl(path: string | null): Promise<string | null> {
    if (!path || path.startsWith("/")) return path;
    const cached = this.objectUrls.get(path);
    if (cached) return cached;

    const blob = await readBlob(path);
    if (!blob) return null;
    const url = URL.createObjectURL(blob);
    this.objectUrls.set(path, url);
    return url;
  }

  async clear(): Promise<void> {
    for (const url of this.objectUrls.values()) URL.revokeObjectURL(url);
    this.objectUrls.clear();
    await clearBlobs();
  }

  private revoke(path: string): void {
    const url = this.objectUrls.get(path);
    if (!url) return;
    URL.revokeObjectURL(url);
    this.objectUrls.delete(path);
  }
}
