import { createFileRoute } from "@tanstack/react-router";

import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { getPagina, listIndicadores } from "@/lib/content.functions";
import type { IndicadorResumo, PaginaConteudo } from "@/lib/content.functions";
import { paragraphs } from "@/lib/format";

interface SobreData {
  pagina: PaginaConteudo | null;
  indicadores: IndicadorResumo[];
}

export const Route = createFileRoute("/itnc/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a ITNC — Incubadora de Empresas e Inovação" },
      {
        name: "description",
        content:
          "Conheça a história, a missão e a atuação da ITNC no apoio a startups de base tecnológica e no fortalecimento do ecossistema de inovação.",
      },
      { property: "og:title", content: "Sobre a ITNC" },
      {
        property: "og:description",
        content: "História, missão e atuação da incubadora de empresas ITNC.",
      },
    ],
  }),
  loader: async (): Promise<SobreData> => {
    const [pagina, indicadores] = await Promise.all([
      getPagina({ data: { slug: "sobre" } }),
      listIndicadores(),
    ]);
    return { pagina: pagina as PaginaConteudo | null, indicadores: indicadores as IndicadorResumo[] };
  },
  component: SobrePage,
});

function SobrePage() {
  const { pagina, indicadores } = Route.useLoaderData() as SobreData;

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Institucional"
        title={pagina?.titulo ?? "Sobre a ITNC"}
        description={
          pagina?.resumo ??
          "Incubadora de empresas de base tecnológica que conecta pesquisa, mercado e empreendedorismo."
        }
      />

      <section className="container-page grid gap-12 py-16 md:grid-cols-[1.2fr_0.8fr]">
        <div className="prose-content max-w-2xl">
          {paragraphs(pagina?.conteudo).map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        {indicadores.length > 0 ? (
          <aside>
            <p className="eyebrow">Indicadores</p>
            <dl className="mt-5 grid gap-4">
              {indicadores.map((item) => (
                <div key={item.id} className="card-elevated rounded-xl p-5">
                  <dt className="font-display text-2xl font-bold text-navy">{item.valor}</dt>
                  <dd className="mt-1 text-sm font-semibold">{item.titulo}</dd>
                </div>
              ))}
            </dl>
          </aside>
        ) : null}
      </section>
    </SiteLayout>
  );
}
