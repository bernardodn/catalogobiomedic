import { describe, expect, it } from "vitest";

import robots from "./robots";
import sitemap from "./sitemap";

describe("public SEO routes", () => {
  it("keeps the admin area out of search engines", () => {
    expect(robots().rules).toMatchObject({ allow: ["/", "/catalogo"], disallow: "/admin" });
  });

  it("lists only public pages in the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toEqual(expect.arrayContaining([expect.stringMatching(/\/$/), expect.stringMatching(/\/catalogo$/)]));
    expect(urls.some((url) => url.includes("/admin"))).toBe(false);
  });
});
