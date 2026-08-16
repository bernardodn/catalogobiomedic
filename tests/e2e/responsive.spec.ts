import { expect, test } from "@playwright/test";

test("public catalog and admin remain within a 390px viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/catalogo");
  await page.getByRole("button", { name: "Filtros" }).click();
  await expect(page.getByRole("dialog", { name: "Filtros do catálogo" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Filtros" })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill("admin@biomedic.demo");
  await page.getByLabel("Senha").fill("BioMedic@2026");
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.goto("/admin/catalogo");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
