export type DataMode = "demo" | "supabase";

export function resolveDataMode(
  value = process.env.NEXT_PUBLIC_DATA_MODE,
): DataMode {
  if (value === undefined || value === "" || value === "demo") {
    return "demo";
  }

  if (value === "supabase") {
    return "supabase";
  }

  throw new Error(`NEXT_PUBLIC_DATA_MODE inválido: ${value}`);
}
