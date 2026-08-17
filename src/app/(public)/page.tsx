import { AboutSection } from "@/components/public/about-section";
import { ContactSection } from "@/components/public/contact-section";
import { FeaturedCatalog } from "@/components/public/featured-catalog";
import { HeroSearch } from "@/components/public/hero-search";
import { PharmaceuticalFormsSection } from "@/components/catalog/pharmaceutical-forms-section";

export default function HomePage() {
  return (
    <>
      <section className="clinical-grid relative overflow-hidden border-b py-20 sm:py-28">
        <div className="absolute inset-x-0 top-0 h-1 bg-primary" aria-hidden="true" />
        <div className="page-container text-center">
          <p className="text-sm font-medium text-primary">Catálogo técnico BioMedic</p>
          <h1 className="mx-auto mt-5 max-w-4xl text-balance text-4xl font-semibold tracking-[-0.045em] text-brand-navy sm:text-6xl">
            Encontre o item que procura
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            Consulte itens disponíveis para manipulação de forma rápida e prática.
          </p>
          <div className="mt-10">
            <HeroSearch />
          </div>
        </div>
      </section>
      <div className="page-container py-12 sm:py-16">
        <PharmaceuticalFormsSection />
      </div>
      <FeaturedCatalog />
      <AboutSection />
      <ContactSection />
    </>
  );
}
