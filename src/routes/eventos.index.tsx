import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";

import { EmptyState, PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { listEventos } from "@/lib/content.functions";
import type { EventoResumo } from "@/lib/content.functions";
import { formatDateTime, formatDayMonth } from "@/lib/format";

export const Route = createFileRoute("/eventos/")({
  head: () => ({
    meta: [
      { title: "Agenda de Eventos — ITNC Incubadora" },
      {
        name: "description",
        content:
          "Workshops, meetups, demo days e capacitações da incubadora do ITNC. Confira a agenda e faça sua inscrição.",
      },
      { property: "og:title", content: "Agenda de Eventos — ITNC" },
      {
        property: "og:description",
        content: "Workshops, meetups e demo days do ecossistema de inovação do ITNC.",
      },
    ],
  }),
  loader: async (): Promise<EventoResumo[]> => (await listEventos()) as EventoResumo[],
  component: EventosPage,
});

function EventosPage() {
  const eventos = Route.useLoaderData() as EventoResumo[];

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Agenda"
        title="Eventos"
        description="Capacitações, encontros e demo days abertos à comunidade empreendedora."
      />

      <section className="container-page py-16">
        {eventos.length === 0 ? (
          <EmptyState message="Nenhum evento publicado no momento." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {eventos.map((evento) => {
              const { dia, mes } = formatDayMonth(evento.inicio);
              return (
                <article key={evento.id} className="card-elevated flex gap-5 rounded-2xl p-6">
                  <div className="surface-navy flex size-16 shrink-0 flex-col items-center justify-center rounded-xl">
                    <span className="font-display text-xl font-bold leading-none">{dia}</span>
                    <span className="mt-1 text-[10px] font-semibold tracking-wider">{mes}</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold leading-snug">{evento.titulo}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDateTime(evento.inicio)}
                    </p>
                    {evento.local ? (
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="size-3.5" aria-hidden />
                        {evento.local}
                      </p>
                    ) : null}
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {evento.resumo}
                    </p>
                    <Link
                      to="/eventos/$slug"
                      params={{ slug: evento.slug }}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-highlight hover:underline"
                    >
                      Detalhes do evento
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
