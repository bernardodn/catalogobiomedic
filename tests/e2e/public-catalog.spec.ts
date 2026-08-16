import { expect, test } from "@playwright/test";

test("hero search finds an accent-insensitive catalog item without commerce controls", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Pesquisar no catálogo").fill("magnesio");
  await page.getByRole("button", { name: "Pesquisar" }).click();

  await expect(page).toHaveURL(/\/catalogo\?q=magnesio/);
  await expect(page.getByRole("heading", { name: "Magnésio Bisglicinato" })).toBeVisible();
  const cards = page.getByTestId("catalog-card");
  await expect(cards).toHaveCount(1);
  await expect(cards).not.toContainText(/R\$|comprar|detalhes/i);
});

test("type filter, sorting and empty-state reset stay reflected in the URL", async ({ page }) => {
  await page.goto("/catalogo");
  await expect(page.getByText("17 itens disponíveis")).toBeVisible();
  await page.getByRole("button", { name: "Produtos" }).click();
  await expect(page).toHaveURL(/type=product/);
  await expect(page.getByTestId("catalog-card")).toHaveCount(4);

  await page.getByLabel("Ordenar por").click();
  await page.getByRole("option", { name: "Nome Z–A" }).click();
  await expect(page).toHaveURL(/sort=name-desc/);

  await page.getByLabel("Pesquisar no catálogo").fill("termo inexistente xyz");
  await expect(page.getByRole("heading", { name: "Nenhum item encontrado" })).toBeVisible();
  await page.getByRole("button", { name: "Limpar busca e filtros" }).click();
  await expect(page.getByText("17 itens disponíveis")).toBeVisible();
});
