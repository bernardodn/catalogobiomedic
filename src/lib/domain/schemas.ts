import { z } from "zod";

const keywordSchema = z
  .string()
  .trim()
  .min(1, "Informe uma palavra-chave.")
  .max(40, "Use no máximo 40 caracteres por palavra-chave.");

export const catalogItemSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome.").max(120, "Use no máximo 120 caracteres."),
  type: z.enum(["active", "product"]),
  categoryId: z.uuid("Selecione uma categoria válida."),
  shortDescription: z
    .string()
    .trim()
    .min(1, "Informe a descrição curta.")
    .max(320, "Use no máximo 320 caracteres."),
  keywords: z
    .array(keywordSchema)
    .max(20, "Cadastre no máximo 20 palavras-chave."),
  imagePath: z.string().nullable(),
  active: z.boolean(),
});

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe ao menos 2 caracteres.")
    .max(80, "Use no máximo 80 caracteres."),
});

export type CatalogItemFormValues = z.infer<typeof catalogItemSchema>;
export type CategoryFormValues = z.infer<typeof categorySchema>;
