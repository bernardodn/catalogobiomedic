import { beforeEach, describe, expect, it } from "vitest";

import {
  DEMO_DATABASE_KEY,
  readDemoDatabase,
  resetDemoDatabase,
  writeDemoDatabase,
} from "./database";

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
});
