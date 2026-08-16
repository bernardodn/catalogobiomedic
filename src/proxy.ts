import { NextResponse, type NextRequest } from "next/server";

import { resolveDataMode } from "@/lib/config/env";
import { updateSupabaseSession } from "@/lib/data/supabase/proxy";

export async function proxy(request: NextRequest) {
  if (resolveDataMode() === "demo") return NextResponse.next();
  return updateSupabaseSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
