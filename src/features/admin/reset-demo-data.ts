import type { Repositories } from "@/lib/data/contracts";
import { resetDemoDatabase } from "@/lib/data/demo/database";

export async function resetDemoData(repositories: Repositories): Promise<void> {
  resetDemoDatabase();
  await repositories.images.clear();
}
