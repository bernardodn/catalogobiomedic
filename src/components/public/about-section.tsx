import { BIOMEDIC_ABOUT } from "@/lib/config/content";

export function AboutSection() {
  return (
    <section id="sobre" className="border-y bg-brand-navy py-20 text-white scroll-mt-20">
      <div className="page-container grid gap-10 md:grid-cols-[0.7fr_1.3fr] md:items-start">
        <div>
          <span className="text-sm font-medium text-primary">Sobre a BioMedic</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Manipulação com atendimento próximo.
          </h2>
        </div>
        <p className="max-w-2xl text-lg leading-8 text-white/75">{BIOMEDIC_ABOUT}</p>
      </div>
    </section>
  );
}
