import Image from "next/image";
import Link from "next/link";
import { Clock3, MapPin, MessageCircle, Phone } from "lucide-react";

import { BIOMEDIC_CONTACT } from "@/lib/config/content";

export function Footer() {
  return (
    <footer className="border-t bg-muted/55">
      <div className="page-container grid gap-10 py-12 md:grid-cols-[1.1fr_1fr_1fr]">
        <div>
          <Image
            src="/brand/biomedic-logo.png"
            alt="BioMedic Farmácia de Manipulação"
            width={178}
            height={50}
          />
          <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">
            Consulta técnica de ativos e produtos disponíveis para manipulação.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Atendimento</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <a href={BIOMEDIC_CONTACT.phone.href}>{BIOMEDIC_CONTACT.phone.label}</a>
            </li>
            {BIOMEDIC_CONTACT.whatsapps.map((whatsapp) => (
              <li key={whatsapp.href} className="flex gap-3">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <a href={whatsapp.href} aria-label={`WhatsApp ${whatsapp.label}`}>
                  {whatsapp.label}
                </a>
              </li>
            ))}
            <li className="flex gap-3">
              <Clock3 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{BIOMEDIC_CONTACT.hours}</span>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Localização</h2>
          <a
            href={BIOMEDIC_CONTACT.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex gap-3 text-sm leading-6 text-muted-foreground hover:text-foreground"
          >
            <MapPin className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{BIOMEDIC_CONTACT.address} (abre em nova aba)</span>
          </a>
        </div>
      </div>
      <div className="border-t">
        <div className="page-container flex flex-col gap-3 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} BioMedic Farmácia de Manipulação.</span>
          <Link href="/catalogo" className="hover:text-foreground">
            Consultar catálogo
          </Link>
        </div>
      </div>
    </footer>
  );
}
