import { expect, test } from "@playwright/test";
import { join } from "node:path";

async function login(page: import("@playwright/test").Page) {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill("admin@biomedic.demo");
  await page.getByLabel("Senha").fill("BioMedic@2026");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test("creates, edits, hides and deletes a catalog item with an optimized image", async ({ page }) => {
  await login(page);
  await page.goto("/admin/catalogo");
  await page.getByRole("link", { name: "Novo item" }).click();
  await page.getByLabel("Nome").fill("Ativo E2E");
  await page.getByLabel("Tipo").selectOption("active");
  await page.getByLabel("Categoria").selectOption({ label: "Vitaminas" });
  await page.getByLabel("Descrição curta").fill("Cadastro automatizado de validação do catálogo.");
  await page.getByLabel("Palavras-chave").fill("automação");
  await page.getByLabel("Palavras-chave").press("Enter");
  await page.getByLabel("Selecionar imagem").setInputFiles(join(process.cwd(), "public/brand/biomedic-logo.png"));
  await expect(page.getByAltText("Prévia do item")).toBeVisible();
  await page.getByRole("button", { name: "Salvar item" }).click();

  await expect(page).toHaveURL(/\/admin\/catalogo$/);
  const row = page.getByRole("row", { name: /Ativo E2E/ });
  await expect(row).toBeVisible();
  await row.getByRole("link", { name: "Editar Ativo E2E" }).click();
  await page.getByLabel("Nome").fill("Ativo E2E Atualizado");
  await page.getByRole("button", { name: "Salvar item" }).click();
  await expect(page.getByText("Item atualizado.")).toBeVisible();

  await page.goto("/admin/catalogo");
  const updatedRow = page.getByRole("row", { name: /Ativo E2E Atualizado/ });
  await updatedRow.getByRole("switch", { name: "Desativar Ativo E2E Atualizado" }).click();
  await expect(updatedRow).toContainText("Oculto");
  await updatedRow.getByRole("button", { name: "Excluir Ativo E2E Atualizado" }).click();
  await page.getByRole("button", { name: "Excluir definitivamente" }).click();
  await expect(updatedRow).toHaveCount(0);
});
