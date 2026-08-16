import { ValidationError } from "@/lib/data/errors";

const ACCEPTED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_DIMENSION = 1600;

export async function optimizeCatalogImage(file: File): Promise<Blob> {
  if (!ACCEPTED_TYPES.has(file.type)) {
    throw new ValidationError("Use uma imagem PNG, JPEG ou WebP.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new ValidationError("A imagem deve ter no máximo 5 MB.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  try {
    if (typeof OffscreenCanvas !== "undefined") {
      const canvas = new OffscreenCanvas(width, height);
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas indisponível.");
      context.drawImage(bitmap, 0, 0, width, height);
      return canvas.convertToBlob({ type: "image/webp", quality: 0.84 });
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas indisponível.");
    context.drawImage(bitmap, 0, 0, width, height);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Falha ao converter imagem."))),
        "image/webp",
        0.84,
      );
    });
  } finally {
    bitmap.close();
  }
}
