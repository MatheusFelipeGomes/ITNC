import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Rocket } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState, PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listEmpresas, type EmpresaResumo } from "@/lib/content.functions";
import { SITUACAO_EMPRESA } from "@/lib/format";

const FILTROS = [
  { value: "todas", label: "Todas" },
  { value: "incubada", label: "Incubadas" },
  { value: "graduada", label: "Graduadas" },
  { value: "associada", label: "Associadas" },
];

export const Route = createFileRoute("/empresas/")({
  head: () => ({
    meta: [
      { title: "Empresas Incubadas — Portfólio da ITNC" },
      {
        name: "description",
        content:
          "Conheça as startups incubadas, graduadas e associadas da ITNC e as soluções tecnológicas que elas desenvolvem.",
      },
      { property: "og:title", content: "Empresas Incubadas — ITNC" },
      {
        property: "og:description",
        content: "Portfólio de startups de base tecnológica apoiadas pela incubadora ITNC.",
      },
    ],
  }),
  loader: async (): Promise<EmpresaResumo[]> => (await listEmpresas()) as EmpresaResumo[],
  component: EmpresasPage,
});

function EmpresasPage() {
  const empresas = Route.useLoaderData() as EmpresaResumo[];
  const [filtro, setFiltro] = useState("todas");

  const lista = useMemo(
    () => (filtro === "todas" ? empresas : empresas.filter((e) => e.situacao === filtro)),
    [empresas, filtro],
  );

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Portfólio"
        title="Empresas incubadas"
        description="Startups de base tecnológica apoiadas pela ITNC em diferentes setores da economia."
      />

      <section className="container-page py-16">
        <div className="flex flex-wrap gap-2">
          {FILTROS.map((item) => (
            <Button
              key={item.value}
              variant={filtro === item.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFiltro(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {lista.length === 0 ? (
            <div className="md:col-span-3">
              <EmptyState message="Nenhuma empresa nesta categoria." />
            </div>
          ) : (
            lista.map((empresa) => (
              <article
                key={empresa.id}
                className="card-elevated flex flex-col rounded-2xl p-6 transition-shadow duration-300 hover:shadow-elevated"
              >
                <div className="flex items-center justify-between gap-3">
                  {empresa.imagem_url ? (
                    <img
                      src={empresa.imagem_url}
                      alt={empresa.titulo}
                      loading="lazy"
                      className="h-10 w-auto max-w-32 object-contain"
                    />
                  ) : (
                    <span className="surface-highlight flex size-10 items-center justify-center rounded-lg">
                      <Rocket className="size-5" aria-hidden />
                    </span>
                  )}
                  <Badge variant="secondary">
                    {SITUACAO_EMPRESA[empresa.situacao] ?? empresa.situacao}
                  </Badge>
                </div>
                <h2 className="mt-5 text-lg font-semibold">{empresa.titulo}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {[empresa.setor, empresa.ano_ingresso].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{empresa.resumo}</p>
                <Link
                  to="/empresas/$slug"
                  params={{ slug: empresa.slug }}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-highlight hover:underline"
                >
                  Ver empresa
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
