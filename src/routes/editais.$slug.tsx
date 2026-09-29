import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarClock, Download } from "lucide-react";

import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEdital } from "@/lib/content.functions";
import type { EditalDetalhe } from "@/lib/content.functions";
import { formatShortDate, paragraphs, SITUACAO_EDITAL } from "@/lib/format";

export const Route = createFileRoute("/editais/$slug")({
  loader: async ({ params }): Promise<EditalDetalhe> => {
    const edital = (await getEdital({ data: { slug: params.slug } })) as EditalDetalhe | null;
    if (!edital) throw notFound();
    return edital;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Edital não encontrado — ITNC" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      meta: [
        { title: `${loaderData.titulo} — Editais ITNC` },
        { name: "description", content: loaderData.resumo },
        { property: "og:title", content: loaderData.titulo },
        { property: "og:description", content: loaderData.resumo },
        { property: "og:type", content: "article" },
      ],
    };
  },
  errorComponent: () => <EditalFallback title="Não foi possível carregar o edital" />,
  notFoundComponent: () => <EditalFallback title="Edital não encontrado" />,
  component: EditalDetalhePage,
});

function EditalFallback({ title }: { title: string }) {
  return (
    <SiteLayout>
      <PageHero eyebrow="Editais" title={title} />
      <div className="container-page py-16">
        <Button asChild variant="outline">
          <Link to="/editais">Voltar para editais</Link>
        </Button>
      </div>
    </SiteLayout>
  );
}

function EditalDetalhePage() {
  const edital = Route.useLoaderData() as EditalDetalhe;

  return (
    <SiteLayout>
      <article>
        <section className="surface-navy">
          <div className="container-page py-16 md:py-20">
            <Badge variant="secondary">
              {SITUACAO_EDITAL[edital.situacao] ?? edital.situacao}
            </Badge>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight md:text-5xl">
              {edital.titulo}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-primary-foreground/80">{edital.resumo}</p>
            {edital.inscricoes_inicio || edital.inscricoes_fim ? (
              <p className="mt-6 flex items-center gap-2 text-sm text-primary-foreground/75">
                <CalendarClock className="size-4" aria-hidden />
                Inscrições: {formatShortDate(edital.inscricoes_inicio)}
                {edital.inscricoes_fim ? ` até ${formatShortDate(edital.inscricoes_fim)}` : ""}
              </p>
            ) : null}
          </div>
        </section>

        <div className="container-page max-w-3xl py-14">
          <div className="space-y-5 text-base leading-relaxed text-foreground/90">
            {paragraphs(edital.conteudo).map((paragrafo, index) => (
              <p key={index}>{paragrafo}</p>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            {edital.arquivo_url ? (
              <Button asChild>
                <a href={edital.arquivo_url} target="_blank" rel="noreferrer">
                  <Download className="size-4" aria-hidden />
                  Baixar documento do edital
                </a>
              </Button>
            ) : null}
            <Button asChild variant="outline">
              <Link to="/editais">
                <ArrowLeft className="size-4" aria-hidden />
                Voltar para editais
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}
