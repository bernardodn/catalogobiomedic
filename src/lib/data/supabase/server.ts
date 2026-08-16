import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabasePublicConfig } from "./client";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const { url, publishableKey } = getSupabasePublicConfig();
  return createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (entries) => {
        try {
          for (const entry of entries) cookieStore.set(entry.name, entry.value, entry.options);
        } catch {
          // Server Components cannot write cookies; proxy.ts performs session refresh.
        }
      },
    },
  });
}
