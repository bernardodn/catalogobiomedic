import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("Supabase catalog migration", () => {
  const directory = join(process.cwd(), "supabase", "migrations");
  const migration = readFileSync(join(directory, readdirSync(directory).find((file) => file.endsWith("_initial_catalog_schema.sql"))!), "utf8");

  it("enables RLS for every exposed application table", () => {
    for (const table of ["profiles", "categories", "catalog_items"]) {
      expect(migration).toContain(`alter table public.${table} enable row level security`);
    }
  });

  it("keeps admin checks private and public reads limited to active items", () => {
    expect(migration).toContain("function private.is_admin()");
    expect(migration).toContain("for select to anon using (active = true)");
    expect(migration).toContain("security invoker");
  });

  it("protects the catalog image bucket", () => {
    expect(migration).toContain("'catalog-images'");
    expect(migration).toContain("catalog_images_admin_insert");
    expect(migration).toContain("file_size_limit");
  });
});
