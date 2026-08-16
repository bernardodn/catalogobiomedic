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
  title: "Catálogo de Ativos | BioMedic Farmácia de Manipulação",
  description:
    "Consulte produtos e ativos disponíveis na BioMedic Farmácia de Manipulação.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="pt-BR"
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
