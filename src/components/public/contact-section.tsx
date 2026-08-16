import { Clock3, MapPin, MessageCircle, Phone } from "lucide-react";

import { BIOMEDIC_CONTACT } from "@/lib/config/content";

const contacts = [
  {
    title: "Telefone",
    value: BIOMEDIC_CONTACT.phone.label,
    href: BIOMEDIC_CONTACT.phone.href,
    icon: Phone,
  },
  {
    title: "WhatsApp",
    value: BIOMEDIC_CONTACT.whatsapps[0].label,
    href: BIOMEDIC_CONTACT.whatsapps[0].href,
    icon: MessageCircle,
  },
  {
    title: "Horário",
    value: BIOMEDIC_CONTACT.hours,
    icon: Clock3,
  },
  {
    title: "Endereço",
    value: BIOMEDIC_CONTACT.address,
    href: BIOMEDIC_CONTACT.mapUrl,
    icon: MapPin,
  },
];

export function ContactSection() {
  return (
    <section id="contato" className="py-20 scroll-mt-20">
      <div className="page-container">
        <div className="max-w-2xl">
          <span className="text-sm font-medium text-primary">Contato</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Fale com a equipe BioMedic
          </h2>
          <p className="mt-4 text-muted-foreground">
            Entre em contato para informações institucionais e atendimento da farmácia.
          </p>
        </div>
        <div className="mt-10 grid border-l border-t sm:grid-cols-2 lg:grid-cols-4">
          {contacts.map(({ title, value, href, icon: Icon }) => {
            const content = (
              <>
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <h3 className="mt-8 text-sm font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{value}</p>
              </>
            );
            return href ? (
              <a
                key={title}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="border-b border-r p-6 transition-colors hover:bg-muted/60"
              >
                {content}
              </a>
            ) : (
              <div key={title} className="border-b border-r p-6">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
