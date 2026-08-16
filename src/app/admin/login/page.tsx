import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Área Administrativa | BioMedic",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="clinical-grid min-h-screen px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        <Link href="/" aria-label="Voltar ao início" className="mb-9 bg-white px-4 py-2">
          <Image
            src="/brand/biomedic-logo.png"
            alt="BioMedic Farmácia de Manipulação"
            width={178}
            height={50}
            priority
          />
        </Link>
        <LoginForm />
        <Link href="/" className="mt-7 text-sm text-muted-foreground hover:text-foreground">
          Voltar ao catálogo público
        </Link>
      </div>
    </main>
  );
}
