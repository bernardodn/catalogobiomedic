import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { DataProvider } from "@/lib/data/provider";
import { Toaster } from "sonner";

import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Catálogo BioMedic | Farmácia de Manipulação",
  description:
    "Consulte itens disponíveis na BioMedic Farmácia de Manipulação.",
  openGraph: {
    title: "Catálogo BioMedic",
    description: "Consulte itens disponíveis para manipulação.",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/brand/biomedic-logo.png", width: 269, height: 79, alt: "BioMedic Farmácia de Manipulação" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <DataProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors position="top-right" />
        </DataProvider>
      </body>
    </html>
  );
}
