import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Handshake } from "lucide-react";

import { EmptyState, PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { listParceiros, type ParceiroResumo } from "@/lib/content.functions";

export const Route = createFileRoute("/itnc/parceiros")({
  head: () => ({
    meta: [
      { title: "Parceiros da ITNC — Rede de Inovação" },
      {
        name: "description",
        content:
          "Instituições de ensino, poder público, empresas e investidores que apoiam a incubadora ITNC e suas startups.",
      },
      { property: "og:title", content: "Parceiros da ITNC" },
      {
        property: "og:description",
        content: "Conheça a rede de parceiros institucionais, de fomento e de investimento da ITNC.",
      },
    ],
  }),
  loader: async (): Promise<ParceiroResumo[]> => (await listParceiros()) as ParceiroResumo[],
  component: ParceirosPage,
});

function ParceirosPage() {
  const parceiros = Route.useLoaderData() as ParceiroResumo[];

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Rede"
        title="Parceiros"
        description="Uma rede de instituições, empresas e investidores que fortalece o ecossistema de inovação."
      />

      <section className="container-page py-16">
        {parceiros.length === 0 ? (
          <EmptyState message="Nenhum parceiro publicado no momento." />
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {parceiros.map((parceiro) => (
              <li
                key={parceiro.id}
                className="card-elevated flex flex-col rounded-2xl p-6 transition-shadow duration-300 hover:shadow-elevated"
              >
                <div className="flex items-center justify-between gap-3">
                  {parceiro.imagem_url ? (
                    <img
                      src={parceiro.imagem_url}
                      alt={parceiro.titulo}
                      loading="lazy"
                      className="h-10 w-auto max-w-32 object-contain"
                    />
                  ) : (
                    <span className="surface-navy flex size-10 items-center justify-center rounded-lg">
                      <Handshake className="size-5" aria-hidden />
                    </span>
                  )}
                  <Badge variant="secondary">{parceiro.categoria}</Badge>
                </div>
                <h2 className="mt-5 text-lg font-semibold">{parceiro.titulo}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{parceiro.resumo}</p>
                {parceiro.site_url ? (
                  <a
                    href={parceiro.site_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-highlight hover:underline"
                  >
                    Visitar site
                    <ExternalLink className="size-4" aria-hidden />
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </SiteLayout>
  );
}
