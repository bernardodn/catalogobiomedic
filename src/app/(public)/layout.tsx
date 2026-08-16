import type { ReactNode } from "react";

import { Footer } from "@/components/public/footer";
import { Header } from "@/components/public/header";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
