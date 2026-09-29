import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { getPagina, listEditais } from "@/lib/content.functions";
import type { EditalResumo, PaginaConteudo } from "@/lib/content.functions";
import { paragraphs, SITUACAO_EDITAL } from "@/lib/format";

interface IncubacaoData {
  pagina: PaginaConteudo | null;
  editais: EditalResumo[];
}

export const Route = createFileRoute("/incubacao")({
  head: () => ({
    meta: [
      { title: "Programa de Incubação — ITNC" },
      {
        name: "description",
        content:
          "Pré-incubação, incubação e graduação: conheça as etapas, os benefícios e como participar do programa de incubação da ITNC.",
      },
      { property: "og:title", content: "Programa de Incubação — ITNC" },
      {
        property: "og:description",
        content: "Etapas, benefícios e formas de ingresso no programa de incubação da ITNC.",
      },
    ],
  }),
  loader: async (): Promise<IncubacaoData> => {
    const [pagina, editais] = await Promise.all([
      getPagina({ data: { slug: "incubacao" } }),
      listEditais(),
    ]);
    return { pagina: pagina as PaginaConteudo | null, editais: editais as EditalResumo[] };
  },
  component: IncubacaoPage,
});

function IncubacaoPage() {
  const { pagina, editais } = Route.useLoaderData() as IncubacaoData;
  const blocos = paragraphs(pagina?.conteudo);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Programa"
        title={pagina?.titulo ?? "Programa de Incubação"}
        description={
          pagina?.resumo ??
          "Trilha estruturada de pré-incubação, incubação e graduação para startups de base tecnológica."
        }
      />

      <section className="container-page py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {(blocos.length > 1 ? blocos.slice(1) : blocos).map((bloco, index) => (
            <article key={bloco} className="card-elevated rounded-2xl p-7">
              <span className="font-display text-3xl font-bold text-highlight">0{index + 1}</span>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{bloco}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 py-16">
        <div className="container-page">
          <div className="grid gap-4 sm:flex sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Como participar</p>
              <h2 className="mt-3 text-2xl font-bold md:text-3xl">Editais de seleção</h2>
            </div>
            <Button asChild variant="outline" className="shrink-0">
              <Link to="/editais">Todos os editais</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-4">
            {editais.slice(0, 4).map((edital) => (
              <Link
                key={edital.id}
                to="/editais/$slug"
                params={{ slug: edital.slug }}
                className="card-elevated flex items-center justify-between gap-4 rounded-xl p-5 transition-shadow hover:shadow-elevated"
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{edital.titulo}</span>
                  <span className="text-xs text-muted-foreground">
                    {SITUACAO_EDITAL[edital.situacao] ?? edital.situacao}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-highlight" aria-hidden />
              </Link>
            ))}
            {editais.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum edital aberto no momento. Acompanhe nossas notícias para novas chamadas.
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
