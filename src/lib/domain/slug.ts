import { normalizeText } from "./search";

export function slugify(value: string): string {
  const slug = normalizeText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) {
    throw new Error("Não foi possível gerar o slug.");
  }

  return slug;
}
