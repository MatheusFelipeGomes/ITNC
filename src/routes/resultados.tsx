import { createFileRoute } from "@tanstack/react-router";
import { Award } from "lucide-react";

import { EmptyState, PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { getPagina, listConquistas, listIndicadores } from "@/lib/content.functions";
import type { ConquistaResumo, IndicadorResumo, PaginaConteudo } from "@/lib/content.functions";
import { paragraphs } from "@/lib/format";

interface ResultadosData {
  pagina: PaginaConteudo | null;
  indicadores: IndicadorResumo[];
  conquistas: ConquistaResumo[];
}

export const Route = createFileRoute("/resultados")({
  head: () => ({
    meta: [
      { title: "Resultados e Conquistas — ITNC" },
      {
        name: "description",
        content:
          "Indicadores, impacto econômico e social, premiações e certificações conquistadas pela ITNC e suas empresas incubadas.",
      },
      { property: "og:title", content: "Resultados e Conquistas — ITNC" },
      {
        property: "og:description",
        content: "Indicadores de impacto, premiações e certificações do ecossistema da ITNC.",
      },
    ],
  }),
  loader: async (): Promise<ResultadosData> => {
    const [pagina, indicadores, conquistas] = await Promise.all([
      getPagina({ data: { slug: "resultados" } }),
      listIndicadores(),
      listConquistas(),
    ]);
    return {
      pagina: pagina as PaginaConteudo | null,
      indicadores: indicadores as IndicadorResumo[],
      conquistas: conquistas as ConquistaResumo[],
    };
  },
  component: ResultadosPage,
});

function ResultadosPage() {
  const { pagina, indicadores, conquistas } = Route.useLoaderData() as ResultadosData;

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Impacto"
        title={pagina?.titulo ?? "Resultados"}
        description={
          pagina?.resumo ?? "Indicadores e impacto gerado pelo ecossistema de inovação da ITNC."
        }
      />

      {indicadores.length > 0 ? (
        <section className="container-page py-16">
          <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {indicadores.map((item) => (
              <div key={item.id} className="card-elevated rounded-2xl p-6">
                <dt className="font-display text-3xl font-bold text-navy">{item.valor}</dt>
                <dd className="mt-2 text-sm font-semibold">{item.titulo}</dd>
                {item.resumo ? (
                  <dd className="mt-1 text-xs text-muted-foreground">{item.resumo}</dd>
                ) : null}
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {paragraphs(pagina?.conteudo).length > 0 ? (
        <section className="container-page pb-16">
          <div className="prose-content max-w-2xl text-muted-foreground">
            {paragraphs(pagina?.conteudo).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>
      ) : null}

      <section className="bg-secondary/60 py-16">
        <div className="container-page">
          <p className="eyebrow">Conquistas e premiações</p>
          <h2 className="mt-3 text-2xl font-bold md:text-3xl">Reconhecimentos do ecossistema</h2>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {conquistas.length === 0 ? (
              <div className="md:col-span-3">
                <EmptyState message="Nenhuma conquista publicada no momento." />
              </div>
            ) : (
              conquistas.map((item) => (
                <article key={item.id} className="card-elevated rounded-2xl p-6">
                  <span className="surface-highlight flex size-10 items-center justify-center rounded-lg">
                    <Award className="size-5" aria-hidden />
                  </span>
                  <p className="mt-4 text-xs text-muted-foreground">
                    {[item.categoria, item.ano].filter(Boolean).join(" · ")}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">{item.titulo}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.resumo}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
