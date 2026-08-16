import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { proxy } from "./proxy";

describe("proxy", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("leaves admin routing to the client guard in demo mode", async () => {
    vi.stubEnv("NEXT_PUBLIC_DATA_MODE", "demo");
    const response = await proxy(new NextRequest("http://localhost/admin"));

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });
});
