import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Rocket } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEmpresa, type EmpresaDetalhe } from "@/lib/content.functions";
import { paragraphs, SITUACAO_EMPRESA } from "@/lib/format";

export const Route = createFileRoute("/empresas/$slug")({
  loader: async ({ params }): Promise<EmpresaDetalhe> => {
    const empresa = (await getEmpresa({ data: { slug: params.slug } })) as EmpresaDetalhe | null;
    if (!empresa) throw notFound();
    return empresa;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Empresa não encontrada — ITNC" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      meta: [
        { title: `${loaderData.titulo} — Empresa incubada na ITNC` },
        { name: "description", content: loaderData.resumo },
        { property: "og:title", content: `${loaderData.titulo} — ITNC` },
        { property: "og:description", content: loaderData.resumo },
      ],
    };
  },
  notFoundComponent: EmpresaNaoEncontrada,
  component: EmpresaDetalhePage,
});

function EmpresaNaoEncontrada() {
  return (
    <SiteLayout>
      <div className="container-page py-24 text-center">
        <h1 className="text-2xl font-bold">Empresa não encontrada</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          O conteúdo pode ter sido removido ou ainda não está publicado.
        </p>
        <Button asChild className="mt-6">
          <Link to="/empresas">Ver todas as empresas</Link>
        </Button>
      </div>
    </SiteLayout>
  );
}

function EmpresaDetalhePage() {
  const empresa = Route.useLoaderData() as EmpresaDetalhe;

  return (
    <SiteLayout>
      <section className="surface-navy">
        <div className="container-page py-16">
          <Link
            to="/empresas"
            className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/75 hover:text-primary-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Empresas incubadas
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {empresa.imagem_url ? (
              <img
                src={empresa.imagem_url}
                alt={empresa.titulo}
                className="h-14 w-auto max-w-40 object-contain"
              />
            ) : (
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary-foreground/10">
                <Rocket className="size-6" aria-hidden />
              </span>
            )}
            <h1 className="text-3xl font-bold md:text-4xl">{empresa.titulo}</h1>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-primary-foreground/75">
            <Badge variant="secondary">
              {SITUACAO_EMPRESA[empresa.situacao] ?? empresa.situacao}
            </Badge>
            {empresa.setor ? <span>{empresa.setor}</span> : null}
            {empresa.ano_ingresso ? <span>· Desde {empresa.ano_ingresso}</span> : null}
          </div>
        </div>
      </section>

      <article className="container-page grid gap-10 py-16 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-lg text-muted-foreground">{empresa.resumo}</p>
          <div className="prose-content mt-8">
            {paragraphs(empresa.conteudo).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <aside className="card-elevated h-fit rounded-2xl p-6">
          <p className="eyebrow">Contato</p>
          {empresa.site_url ? (
            <a
              href={empresa.site_url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-highlight hover:underline"
            >
              Visitar site da empresa
              <ExternalLink className="size-4" aria-hidden />
            </a>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Site não informado. Fale com a ITNC para ser conectado a esta empresa.
            </p>
          )}
          <Button asChild variant="outline" className="mt-6 w-full">
            <Link to="/contato">Fale conosco</Link>
          </Button>
        </aside>
      </article>
    </SiteLayout>
  );
}
