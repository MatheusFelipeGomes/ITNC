import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getNoticia } from "@/lib/content.functions";
import type { NoticiaDetalhe } from "@/lib/content.functions";
import { formatDate, paragraphs } from "@/lib/format";

export const Route = createFileRoute("/noticias/$slug")({
  loader: async ({ params }): Promise<NoticiaDetalhe> => {
    const noticia = (await getNoticia({ data: { slug: params.slug } })) as NoticiaDetalhe | null;
    if (!noticia) throw notFound();
    return noticia;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Notícia não encontrada — ITNC" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      meta: [
        { title: `${loaderData.titulo} — ITNC` },
        { name: "description", content: loaderData.resumo },
        { property: "og:title", content: loaderData.titulo },
        { property: "og:description", content: loaderData.resumo },
        { property: "og:type", content: "article" },
      ],
    };
  },
  errorComponent: () => <NoticiaFallback title="Não foi possível carregar a notícia" />,
  notFoundComponent: () => <NoticiaFallback title="Notícia não encontrada" />,
  component: NoticiaDetalhePage,
});

function NoticiaFallback({ title }: { title: string }) {
  return (
    <SiteLayout>
      <PageHero eyebrow="Notícias" title={title} />
      <div className="container-page py-16">
        <Button asChild variant="outline">
          <Link to="/noticias">Voltar para notícias</Link>
        </Button>
      </div>
    </SiteLayout>
  );
}

function NoticiaDetalhePage() {
  const noticia = Route.useLoaderData() as NoticiaDetalhe;

  return (
    <SiteLayout>
      <article>
        <section className="surface-navy">
          <div className="container-page py-16 md:py-20">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <Badge variant="secondary">{noticia.categoria}</Badge>
              <time className="text-primary-foreground/70">{formatDate(noticia.publicado_em)}</time>
            </div>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight md:text-5xl">
              {noticia.titulo}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-primary-foreground/80">{noticia.resumo}</p>
          </div>
        </section>

        <div className="container-page max-w-3xl py-14">
          {noticia.imagem_url ? (
            <img
              src={noticia.imagem_url}
              alt={noticia.titulo}
              className="mb-10 w-full rounded-2xl object-cover"
            />
          ) : null}

          <div className="space-y-5 text-base leading-relaxed text-foreground/90">
            {paragraphs(noticia.conteudo).map((paragrafo, index) => (
              <p key={index}>{paragrafo}</p>
            ))}
          </div>

          <div className="mt-12">
            <Button asChild variant="outline">
              <Link to="/noticias">
                <ArrowLeft className="size-4" aria-hidden />
                Voltar para notícias
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}
