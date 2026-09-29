import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, ExternalLink, MapPin } from "lucide-react";

import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { getEvento } from "@/lib/content.functions";
import type { EventoDetalhe } from "@/lib/content.functions";
import { formatDateTime, paragraphs } from "@/lib/format";

export const Route = createFileRoute("/eventos/$slug")({
  loader: async ({ params }): Promise<EventoDetalhe> => {
    const evento = (await getEvento({ data: { slug: params.slug } })) as EventoDetalhe | null;
    if (!evento) throw notFound();
    return evento;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Evento não encontrado — ITNC" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      meta: [
        { title: `${loaderData.titulo} — Eventos ITNC` },
        { name: "description", content: loaderData.resumo },
        { property: "og:title", content: loaderData.titulo },
        { property: "og:description", content: loaderData.resumo },
        { property: "og:type", content: "article" },
      ],
    };
  },
  errorComponent: () => <EventoFallback title="Não foi possível carregar o evento" />,
  notFoundComponent: () => <EventoFallback title="Evento não encontrado" />,
  component: EventoDetalhePage,
});

function EventoFallback({ title }: { title: string }) {
  return (
    <SiteLayout>
      <PageHero eyebrow="Eventos" title={title} />
      <div className="container-page py-16">
        <Button asChild variant="outline">
          <Link to="/eventos">Voltar para agenda</Link>
        </Button>
      </div>
    </SiteLayout>
  );
}

function EventoDetalhePage() {
  const evento = Route.useLoaderData() as EventoDetalhe;

  return (
    <SiteLayout>
      <article>
        <section className="surface-navy">
          <div className="container-page py-16 md:py-20">
            <p className="eyebrow text-primary-foreground/70">Agenda</p>
            <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight md:text-5xl">
              {evento.titulo}
            </h1>
            <div className="mt-5 flex flex-wrap gap-5 text-sm text-primary-foreground/80">
              <span className="flex items-center gap-2">
                <CalendarDays className="size-4" aria-hidden />
                {formatDateTime(evento.inicio)}
                {evento.fim ? ` — ${formatDateTime(evento.fim)}` : ""}
              </span>
              {evento.local ? (
                <span className="flex items-center gap-2">
                  <MapPin className="size-4" aria-hidden />
                  {evento.local}
                </span>
              ) : null}
            </div>
          </div>
        </section>

        <div className="container-page max-w-3xl py-14">
          {evento.imagem_url ? (
            <img
              src={evento.imagem_url}
              alt={evento.titulo}
              className="mb-10 w-full rounded-2xl object-cover"
            />
          ) : null}

          <p className="text-lg font-medium text-foreground">{evento.resumo}</p>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-foreground/90">
            {paragraphs(evento.conteudo).map((paragrafo, index) => (
              <p key={index}>{paragrafo}</p>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            {evento.inscricao_url ? (
              <Button asChild>
                <a href={evento.inscricao_url} target="_blank" rel="noreferrer">
                  Fazer inscrição
                  <ExternalLink className="size-4" aria-hidden />
                </a>
              </Button>
            ) : null}
            <Button asChild variant="outline">
              <Link to="/eventos">
                <ArrowLeft className="size-4" aria-hidden />
                Voltar para agenda
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}
