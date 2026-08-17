const pharmaceuticalForms = [
  "Óvulo",
  "Chocolate terapêutico",
  "Cápsula de Tapioca",
  "Creme",
  "Loção",
  "Comprimido sublingual",
  "Shampoo",
  "Esmalte",
  "Goma",
  "Gel",
  "Cápsula gastro resistente",
  "Pó / Sachê",
  "Frappé",
  "Veículo transdérmico",
  "Flaconetes",
  "Pomada",
  "Sabonete",
  "Solução",
  "Solução capilar",
  "Xarope",
  "Cápsulas oleosas",
] as const;

const availableFlavors = [
  "Uva",
  "Laranja",
  "Tangerina",
  "Maracujá",
  "Abacaxi",
  "Morango",
] as const;

export function PharmaceuticalFormsSection() {
  return (
    <section
      aria-labelledby="pharmaceutical-forms-title"
      className="border bg-card px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-11"
    >
      <div className="max-w-3xl">
        <p className="text-sm font-medium text-primary">
          Formas farmacêuticas
        </p>
        <h2
          id="pharmaceutical-forms-title"
          className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-brand-navy sm:text-4xl"
        >
          Uma forma ideal para cada tratamento
        </h2>
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Formas farmacêuticas disponíveis">
        {pharmaceuticalForms.map((form) => (
          <li
            key={form}
            className="flex min-h-16 items-center border bg-card px-5 py-4 text-base font-medium text-brand-navy"
          >
            {form}
          </li>
        ))}
      </ul>

      <div className="mt-10 border-t pt-8 sm:px-2">
        <p className="text-sm font-medium text-primary">
          Sabores disponíveis
        </p>
        <p className="mt-3 text-base text-muted-foreground">
          Para pó / sachê e demais formas saborizadas.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2.5" aria-label="Sabores disponíveis">
          {availableFlavors.map((flavor) => (
            <li key={flavor} className="border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
              {flavor}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
