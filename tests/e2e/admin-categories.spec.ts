import { expect, test } from "@playwright/test";

async function login(page: import("@playwright/test").Page) {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill("admin@biomedic.demo");
  await page.getByLabel("Senha").fill("BioMedic@2026");
  await page.getByRole("button", { name: "Entrar" }).click();
}

test("creates, renames and deletes an unused category while protecting linked categories", async ({ page }) => {
  await login(page);
  await page.goto("/admin/categorias");
  await page.getByLabel("Nome da categoria").fill("Categoria E2E");
  await page.getByRole("button", { name: "Adicionar categoria" }).click();
  await expect(page.getByText("Categoria E2E", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Editar Categoria E2E" }).click();
  await page.getByLabel("Nome da categoria").fill("Categoria E2E Atualizada");
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(page.getByText("Categoria E2E Atualizada", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Excluir Categoria E2E Atualizada" }).click();
  await page.getByRole("button", { name: "Excluir categoria" }).click();
  await expect(page.getByText("Categoria E2E Atualizada", { exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: "Excluir Antioxidantes" }).click();
  await page.getByRole("button", { name: "Excluir categoria" }).click();
  await expect(page.getByText("A categoria possui itens vinculados.")).toBeVisible();
});

test("restores the initial demo data without signing out", async ({ page }) => {
  await login(page);
  await page.goto("/admin/catalogo");
  const row = page.getByRole("row", { name: /Berberina/ });
  await row.getByRole("button", { name: "Excluir Berberina" }).click();
  await page.getByRole("button", { name: "Excluir definitivamente" }).click();
  await page.goto("/admin/categorias");
  await page.getByRole("button", { name: "Restaurar demonstração" }).click();
  await page.getByRole("button", { name: "Restaurar dados" }).click();
  await expect(page.getByText("Dados de demonstração restaurados.")).toBeVisible();
  await page.goto("/admin/catalogo");
  await expect(page.getByRole("row", { name: /Berberina/ })).toBeVisible();
});
