import { beforeEach, describe, expect, it } from "vitest";

import {
  DEMO_DATABASE_KEY,
  readDemoDatabase,
  resetDemoDatabase,
  writeDemoDatabase,
} from "./database";
import { DEMO_CATEGORIES, DEMO_ITEMS } from "./seed";

describe("demo database", () => {
  beforeEach(() => localStorage.clear());

  it("starts from an independent copy of the seed", () => {
    const database = readDemoDatabase();
    database.items.pop();

    expect(database.categories).toHaveLength(13);
    expect(database.items).toHaveLength(17);
    expect(readDemoDatabase().items).toHaveLength(18);
  });

  it("persists valid changes between reads", () => {
    writeDemoDatabase({ ...readDemoDatabase(), items: [] });

    expect(readDemoDatabase().items).toHaveLength(0);
  });

  it("recovers from malformed persisted data", () => {
    localStorage.setItem(DEMO_DATABASE_KEY, "not-json");

    expect(readDemoDatabase().items).toHaveLength(18);
  });

  it("restores the original seed explicitly", () => {
    writeDemoDatabase({ ...readDemoDatabase(), categories: [] });

    const restored = resetDemoDatabase();

    expect(restored.categories).toHaveLength(13);
    expect(restored.items).toHaveLength(18);
    expect(readDemoDatabase()).toEqual(restored);
  });

  it("migrates version 1 records without losing catalog data", () => {
    const legacyItem = { ...DEMO_ITEMS[0], type: "active" };
    localStorage.setItem(
      DEMO_DATABASE_KEY,
      JSON.stringify({ version: 1, items: [legacyItem], categories: DEMO_CATEGORIES }),
    );

    const migrated = readDemoDatabase();

    expect(migrated.version).toBe(2);
    expect(migrated.items).toHaveLength(1);
    expect(migrated.items[0]).not.toHaveProperty("type");
    expect(migrated.items[0]).toMatchObject({
      id: legacyItem.id,
      imagePath: legacyItem.imagePath,
      categoryId: legacyItem.categoryId,
    });
  });

  it("seeds version 2 records without item types", () => {
    const database = readDemoDatabase();

    expect(database.version).toBe(2);
    expect(database.items).toHaveLength(18);
    expect(database.items.every((item) => !("type" in item))).toBe(true);
  });
});
