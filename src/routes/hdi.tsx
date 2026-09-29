import { createFileRoute, Link } from "@tanstack/react-router";
import { Beaker, Building2, Network, Users } from "lucide-react";

import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { getPagina, type PaginaConteudo } from "@/lib/content.functions";
import { paragraphs } from "@/lib/format";

const RECURSOS = [
  { icon: Beaker, titulo: "Laboratórios", texto: "Estrutura técnica para prototipagem e testes." },
  { icon: Users, titulo: "Coworking", texto: "Ambientes colaborativos para equipes e projetos." },
  { icon: Network, titulo: "Inovação aberta", texto: "Desafios conectando empresas e startups." },
  { icon: Building2, titulo: "PD&I", texto: "Apoio na estruturação de projetos e incentivos." },
];

export const Route = createFileRoute("/hdi")({
  head: () => ({
    meta: [
      { title: "HDI — Hub de Desenvolvimento e Inovação | ITNC" },
      {
        name: "description",
        content:
          "O HDI da ITNC reúne laboratórios, coworking e programas de inovação aberta para empresas, pesquisadores e startups.",
      },
      { property: "og:title", content: "HDI — Hub de Desenvolvimento e Inovação" },
      {
        property: "og:description",
        content: "Ambiente colaborativo de inovação aberta, pesquisa aplicada e projetos de PD&I.",
      },
    ],
  }),
  loader: async (): Promise<PaginaConteudo | null> =>
    (await getPagina({ data: { slug: "hdi" } })) as PaginaConteudo | null,
  component: HdiPage,
});

function HdiPage() {
  const pagina = Route.useLoaderData() as PaginaConteudo | null;

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Ambiente de inovação"
        title={pagina?.titulo ?? "HDI — Hub de Desenvolvimento e Inovação"}
        description={
          pagina?.resumo ??
          "Ambiente colaborativo para inovação aberta, pesquisa aplicada e projetos com empresas."
        }
      />

      <section className="container-page grid gap-12 py-16 md:grid-cols-[1.1fr_0.9fr]">
        <div className="prose-content max-w-2xl">
          {paragraphs(pagina?.conteudo).map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {RECURSOS.map((item) => (
            <article key={item.titulo} className="card-elevated rounded-2xl p-6">
              <span className="surface-highlight flex size-10 items-center justify-center rounded-lg">
                <item.icon className="size-5" aria-hidden />
              </span>
              <h2 className="mt-4 text-base font-semibold">{item.titulo}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{item.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="surface-navy flex flex-wrap items-center justify-between gap-6 rounded-3xl p-10">
          <div>
            <h2 className="text-2xl font-bold">Quer desenvolver um projeto com o HDI?</h2>
            <p className="mt-2 max-w-xl text-primary-foreground/80">
              Empresas, pesquisadores e startups podem propor parcerias de pesquisa e inovação
              aberta.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary" className="hover-scale">
            <Link to="/contato">Fale conosco</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
