import type { Repositories } from "@/lib/data/contracts";
import { DemoAuthRepository } from "./auth-repository";
import { DemoCatalogRepository } from "./catalog-repository";
import { DemoCategoryRepository } from "./category-repository";
import { DemoImageRepository } from "./image-repository";

export function createDemoRepositories(): Repositories {
  return {
    catalog: new DemoCatalogRepository(),
    categories: new DemoCategoryRepository(),
    auth: new DemoAuthRepository(),
    images: new DemoImageRepository(),
  };
}
