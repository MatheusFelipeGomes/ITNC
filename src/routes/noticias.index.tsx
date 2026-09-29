import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText } from "lucide-react";

import { EmptyState, PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { listNoticias } from "@/lib/content.functions";
import type { NoticiaResumo } from "@/lib/content.functions";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/noticias/")({
  head: () => ({
    meta: [
      { title: "Notícias — ITNC Incubadora" },
      {
        name: "description",
        content:
          "Acompanhe as notícias da incubadora do ITNC: programas, resultados, parcerias e novidades do ecossistema de inovação.",
      },
      { property: "og:title", content: "Notícias — ITNC Incubadora" },
      {
        property: "og:description",
        content: "Novidades, resultados e parcerias da incubadora de empresas do ITNC.",
      },
    ],
  }),
  loader: async (): Promise<NoticiaResumo[]> => (await listNoticias()) as NoticiaResumo[],
  component: NoticiasPage,
});

function NoticiasPage() {
  const noticias = Route.useLoaderData() as NoticiaResumo[];

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Comunicação"
        title="Notícias"
        description="Tudo o que acontece na incubadora, nas empresas apoiadas e no ecossistema de inovação."
      />

      <section className="container-page py-16">
        {noticias.length === 0 ? (
          <EmptyState message="Nenhuma notícia publicada no momento." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {noticias.map((noticia) => (
              <article key={noticia.id} className="card-elevated overflow-hidden rounded-2xl">
                {noticia.imagem_url ? (
                  <img
                    src={noticia.imagem_url}
                    alt={noticia.titulo}
                    loading="lazy"
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="surface-navy flex h-44 items-center justify-center">
                    <FileText className="size-8 opacity-70" aria-hidden />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary">{noticia.categoria}</Badge>
                    <time>{formatDate(noticia.publicado_em)}</time>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold leading-snug">{noticia.titulo}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{noticia.resumo}</p>
                  <Link
                    to="/noticias/$slug"
                    params={{ slug: noticia.slug }}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-highlight hover:underline"
                  >
                    Ler notícia
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
