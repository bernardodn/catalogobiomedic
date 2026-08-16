import type { Repositories } from "@/lib/data/contracts";
import { createBrowserSupabaseClient } from "./client";
import { SupabaseAuthRepository } from "./auth-repository";
import { SupabaseCatalogRepository } from "./catalog-repository";
import { SupabaseCategoryRepository } from "./category-repository";
import { SupabaseImageRepository } from "./image-repository";

export function createBrowserSupabaseRepositories(): Repositories {
  const client = createBrowserSupabaseClient();
  return {
    auth: new SupabaseAuthRepository(client),
    catalog: new SupabaseCatalogRepository(client),
    categories: new SupabaseCategoryRepository(client),
    images: new SupabaseImageRepository(client),
  };
}
