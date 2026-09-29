import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarClock } from "lucide-react";

import { EmptyState, PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { listEditais } from "@/lib/content.functions";
import type { EditalResumo } from "@/lib/content.functions";
import { formatShortDate, SITUACAO_EDITAL } from "@/lib/format";

export const Route = createFileRoute("/editais/")({
  head: () => ({
    meta: [
      { title: "Editais e Oportunidades — ITNC Incubadora" },
      {
        name: "description",
        content:
          "Consulte os editais abertos de pré-incubação, incubação e inovação aberta da incubadora do ITNC, com prazos e documentos oficiais.",
      },
      { property: "og:title", content: "Editais e Oportunidades — ITNC" },
      {
        property: "og:description",
        content: "Editais de incubação, pré-incubação e inovação aberta com prazos e documentos.",
      },
    ],
  }),
  loader: async (): Promise<EditalResumo[]> => (await listEditais()) as EditalResumo[],
  component: EditaisPage,
});

function EditaisPage() {
  const editais = Route.useLoaderData() as EditalResumo[];

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Oportunidades"
        title="Editais"
        description="Chamadas públicas para empreendedores, startups e parceiros do ecossistema de inovação."
      />

      <section className="container-page py-16">
        {editais.length === 0 ? (
          <EmptyState message="Nenhum edital publicado no momento." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {editais.map((edital) => (
              <article key={edital.id} className="card-elevated flex flex-col rounded-2xl p-7">
                <Badge variant={edital.situacao === "aberto" ? "default" : "secondary"}>
                  {SITUACAO_EDITAL[edital.situacao] ?? edital.situacao}
                </Badge>
                <h2 className="mt-4 text-xl font-semibold leading-snug">{edital.titulo}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{edital.resumo}</p>
                {edital.inscricoes_inicio || edital.inscricoes_fim ? (
                  <p className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <CalendarClock className="size-4" aria-hidden />
                    Inscrições: {formatShortDate(edital.inscricoes_inicio)}
                    {edital.inscricoes_fim ? ` até ${formatShortDate(edital.inscricoes_fim)}` : ""}
                  </p>
                ) : null}
                <Link
                  to="/editais/$slug"
                  params={{ slug: edital.slug }}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-highlight hover:underline"
                >
                  Ver edital completo
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
