import { expect, test } from "@playwright/test";

test("rejects invalid credentials, persists a valid session and logs out", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill("admin@biomedic.demo");
  await page.getByLabel("Senha").fill("incorreta");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByText("E-mail ou senha inválidos.")).toBeVisible();

  await page.getByLabel("Senha").fill("BioMedic@2026");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Visão geral" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Visão geral" })).toBeVisible();

  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  await page.goto("/admin/catalogo");
  await expect(page).toHaveURL(/\/admin\/login$/);
});
