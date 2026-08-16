import type {
  CatalogItem,
  CatalogItemInput,
  CatalogPage,
  CatalogQuery,
  CatalogStats,
  Category,
} from "@/lib/domain/catalog";

export interface AdminSession {
  userId: string;
  email: string;
  name: string;
  role: "admin";
}

export interface CatalogRepository {
  listPublic(query: CatalogQuery): Promise<CatalogPage>;
  listAdmin(query: CatalogQuery): Promise<CatalogPage>;
  getStats(): Promise<CatalogStats>;
  listRecent(limit: number): Promise<CatalogItem[]>;
  getById(id: string): Promise<CatalogItem | null>;
  create(input: CatalogItemInput): Promise<CatalogItem>;
  update(id: string, input: CatalogItemInput): Promise<CatalogItem>;
  remove(id: string): Promise<void>;
  setActive(id: string, active: boolean): Promise<CatalogItem>;
}

export interface CategoryRepository {
  list(): Promise<Category[]>;
  create(input: { name: string }): Promise<Category>;
  update(id: string, input: { name: string }): Promise<Category>;
  remove(id: string): Promise<void>;
}

export interface AuthRepository {
  getSession(): Promise<AdminSession | null>;
  login(email: string, password: string): Promise<AdminSession>;
  logout(): Promise<void>;
}

export interface ImageRepository {
  upload(itemId: string, file: File): Promise<string>;
  remove(path: string): Promise<void>;
  getUrl(path: string | null): Promise<string | null>;
  clear(): Promise<void>;
}

export interface Repositories {
  catalog: CatalogRepository;
  categories: CategoryRepository;
  auth: AuthRepository;
  images: ImageRepository;
}
