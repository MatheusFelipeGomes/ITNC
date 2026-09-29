import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Building2,
  CalendarDays,
  ExternalLink,
  FileText,
  Handshake,
  Lightbulb,
  Rocket,
  Target,
  Users,
} from "lucide-react";

import heroFallback from "@/assets/hero-inovacao.jpg";
import { EmptyState, SiteLayout } from "@/components/site/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getHomePayload, type HomePayload } from "@/lib/content.functions";
import {
  formatDate,
  formatDateTime,
  formatDayMonth,
  paragraphs,
  SITUACAO_EDITAL,
  SITUACAO_EMPRESA,
} from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ITNC — Incubadora de Empresas, Inovação e Empreendedorismo" },
      {
        name: "description",
        content:
          "A ITNC apoia startups de base tecnológica com incubação, HDI, editais, eventos e uma rede de parceiros de inovação.",
      },
      { property: "og:title", content: "ITNC — Incubadora de Empresas e Inovação" },
      {
        property: "og:description",
        content:
          "Incubação de startups de base tecnológica, editais abertos, resultados e ecossistema de inovação.",
      },
    ],
  }),
  loader: async (): Promise<HomePayload> => (await getHomePayload()) as HomePayload,
  component: Home,
});

const AJUDA = [
  {
    icon: Lightbulb,
    titulo: "Validar a ideia",
    texto: "Pré-incubação com modelagem de negócio, pesquisa de mercado e construção do MVP.",
  },
  {
    icon: Building2,
    titulo: "Estruturar a empresa",
    texto: "Espaço, mentoria, apoio jurídico e contábil para operar com segurança e escalar.",
  },
  {
    icon: Target,
    titulo: "Acessar mercado",
    texto: "Conexão com clientes, editais de fomento, investidores e programas de inovação aberta.",
  },
  {
    icon: Users,
    titulo: "Crescer em rede",
    texto: "Comunidade de empreendedores, universidades e parceiros do ecossistema regional.",
  },
];

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: { to: string; label: string };
}) {
  return (
    <div className="grid gap-4 sm:flex sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 text-2xl font-bold md:text-4xl">{title}</h2>
        {description ? <p className="mt-4 text-muted-foreground">{description}</p> : null}
      </div>
      {action ? (
        <Button asChild variant="outline" className="shrink-0">
          <Link to={action.to}>{action.label}</Link>
        </Button>
      ) : null}
    </div>
  );
}

function Home() {
  const data = Route.useLoaderData() as HomePayload;
  const {
    hero,
    sobre,
    incubacao,
    resultados,
    indicadores,
    empresas,
    parceiros,
    conquistas,
    noticias,
    editais,
    eventos,
  } = data;

  return (
    <SiteLayout>
      {/* HERO */}
      {hero ? (
        <section className="surface-navy relative overflow-hidden">
          <div className="container-page grid items-center gap-12 py-20 md:grid-cols-[1.05fr_0.95fr] md:py-28">
            <div className="animate-fade-in">
              {hero.eyebrow ? (
                <p className="eyebrow text-primary-foreground/70">{hero.eyebrow}</p>
              ) : null}
              <h1 className="mt-4 text-4xl font-bold leading-[1.08] md:text-6xl">{hero.titulo}</h1>
              {hero.subtitulo ? (
                <p className="mt-6 max-w-xl text-base text-primary-foreground/80 md:text-lg">
                  {hero.subtitulo}
                </p>
              ) : null}
              <div className="mt-9 flex flex-wrap gap-3">
                {hero.cta_primario_label && hero.cta_primario_url ? (
                  <Button asChild size="lg" variant="secondary" className="hover-scale">
                    <a href={hero.cta_primario_url}>
                      {hero.cta_primario_label}
                      <ArrowRight className="size-4" aria-hidden />
                    </a>
                  </Button>
                ) : null}
                {hero.cta_secundario_label && hero.cta_secundario_url ? (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/30 bg-transparent text-primary-foreground transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    <a href={hero.cta_secundario_url}>{hero.cta_secundario_label}</a>
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-primary-foreground/15 shadow-2xl">
                <img
                  src={hero.imagem_url ?? heroFallback}
                  alt={hero.titulo}
                  width={1280}
                  height={1024}
                  className="aspect-[5/4] w-full object-cover"
                />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {AJUDA.slice(0, 2).map((item) => (
                  <div
                    key={item.titulo}
                    className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-4"
                  >
                    <item.icon className="size-4 text-primary-foreground/80" aria-hidden />
                    <p className="mt-2 font-display text-sm font-semibold">{item.titulo}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}


      {/* SOBRE */}
      <section className="container-page py-20">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Quem somos</p>
            <h2 className="mt-3 text-2xl font-bold md:text-4xl">{sobre?.titulo ?? "Sobre a ITNC"}</h2>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/itnc/sobre">
                Saber mais
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
          <div className="prose-content text-muted-foreground">
            {(paragraphs(sobre?.conteudo).slice(0, 3).length > 0
              ? paragraphs(sobre?.conteudo).slice(0, 3)
              : [
                  "A ITNC conecta pesquisa, mercado e empreendedorismo para transformar conhecimento em negócios sustentáveis.",
                ]
            ).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* INDICADORES */}
      {indicadores.length > 0 ? (
        <section className="bg-secondary/60 py-16">
          <div className="container-page">
            <p className="eyebrow">Indicadores</p>
            <dl className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
          </div>
        </section>
      ) : null}

      {/* COMO PODEMOS AJUDAR */}
      <section className="container-page py-20">
        <SectionHeader
          eyebrow="Como podemos ajudar"
          title="Apoio em cada etapa da jornada empreendedora"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AJUDA.map((item) => (
            <article
              key={item.titulo}
              className="card-elevated rounded-2xl p-7 transition-shadow duration-300 hover:shadow-elevated"
            >
              <span className="surface-highlight flex size-10 items-center justify-center rounded-lg">
                <item.icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{item.titulo}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.texto}</p>
            </article>
          ))}
        </div>
      </section>

      {/* INCUBAÇÃO */}
      <section className="surface-navy py-20">
        <div className="container-page grid gap-10 md:grid-cols-[1fr_1fr]">
          <div>
            <p className="eyebrow text-primary-foreground/70">Programa</p>
            <h2 className="mt-3 text-2xl font-bold md:text-4xl">
              {incubacao?.titulo ?? "Programa de Incubação"}
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              {incubacao?.resumo ??
                "Trilha estruturada de pré-incubação, incubação e graduação para startups de base tecnológica."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="secondary" className="hover-scale">
                <Link to="/incubacao">Ver o programa</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/hdi">Conhecer o HDI</Link>
              </Button>
            </div>
          </div>
          <ol className="grid gap-4">
            {(paragraphs(incubacao?.conteudo).slice(1, 4).length > 0
              ? paragraphs(incubacao?.conteudo).slice(1, 4)
              : ["Pré-incubação", "Incubação", "Graduação"]
            ).map((etapa, index) => (
              <li
                key={etapa}
                className="flex gap-4 rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-5"
              >
                <span className="font-display text-lg font-bold text-primary-foreground/60">
                  0{index + 1}
                </span>
                <p className="text-sm leading-relaxed text-primary-foreground/80">{etapa}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* EMPRESAS INCUBADAS */}
      <section className="container-page py-20">
        <SectionHeader
          eyebrow="Portfólio"
          title="Empresas incubadas"
          description="Startups apoiadas pela ITNC em diferentes setores de base tecnológica."
          action={{ to: "/empresas", label: "Todas as empresas" }}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {empresas.length === 0 ? (
            <div className="md:col-span-3">
              <EmptyState message="Nenhuma empresa em destaque no momento." />
            </div>
          ) : (
            empresas.map((empresa) => (
              <article
                key={empresa.id}
                className="card-elevated flex flex-col rounded-2xl p-6 transition-shadow duration-300 hover:shadow-elevated"
              >
                <div className="flex items-center justify-between gap-3">
                  {empresa.imagem_url ? (
                    <img
                      src={empresa.imagem_url}
                      alt={empresa.titulo}
                      loading="lazy"
                      className="h-10 w-auto max-w-32 object-contain"
                    />
                  ) : (
                    <span className="surface-highlight flex size-10 items-center justify-center rounded-lg">
                      <Rocket className="size-5" aria-hidden />
                    </span>
                  )}
                  <Badge variant="secondary">
                    {SITUACAO_EMPRESA[empresa.situacao] ?? empresa.situacao}
                  </Badge>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{empresa.titulo}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {[empresa.setor, empresa.ano_ingresso].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-3 line-clamp-3 flex-1 text-sm text-muted-foreground">
                  {empresa.resumo}
                </p>
                <Link
                  to="/empresas/$slug"
                  params={{ slug: empresa.slug }}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-highlight hover:underline"
                >
                  Ver empresa
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

      {/* EDITAIS */}
      <section className="bg-secondary/60 py-20">
        <div className="container-page">
          <SectionHeader
            eyebrow="Oportunidades"
            title="Editais em destaque"
            action={{ to: "/editais", label: "Todos os editais" }}
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {editais.length === 0 ? (
              <div className="md:col-span-3">
                <EmptyState message="Nenhum edital publicado no momento." />
              </div>
            ) : (
              editais.map((edital) => (
                <article
                  key={edital.id}
                  className="card-elevated flex flex-col rounded-2xl p-6 transition-shadow duration-300 hover:shadow-elevated"
                >
                  <Badge variant={edital.situacao === "aberto" ? "default" : "secondary"}>
                    {SITUACAO_EDITAL[edital.situacao] ?? edital.situacao}
                  </Badge>
                  <h3 className="mt-4 text-lg font-semibold leading-snug">{edital.titulo}</h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                    {edital.resumo}
                  </p>
                  <Link
                    to="/editais/$slug"
                    params={{ slug: edital.slug }}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-highlight hover:underline"
                  >
                    Ver edital
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* RESULTADOS */}
      <section className="container-page py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="eyebrow">Impacto</p>
            <h2 className="mt-3 text-2xl font-bold md:text-4xl">
              {resultados?.titulo ?? "Resultados"}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {resultados?.resumo ??
                "Indicadores e impacto econômico e social gerado pelo ecossistema da ITNC."}
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/resultados">
                Ver resultados completos
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>

          {/* CONQUISTAS E PREMIAÇÕES */}
          <div>
            <p className="eyebrow">Conquistas e premiações</p>
            <ul className="mt-5 grid gap-3">
              {conquistas.length === 0 ? (
                <li>
                  <EmptyState message="Nenhuma conquista publicada." />
                </li>
              ) : (
                conquistas.map((item) => (
                  <li key={item.id} className="card-elevated flex gap-4 rounded-xl p-5">
                    <span className="surface-highlight flex size-10 shrink-0 items-center justify-center rounded-lg">
                      <Award className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{item.titulo}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {[item.categoria, item.ano].filter(Boolean).join(" · ")}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.resumo}</p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* PARCEIROS */}
      {parceiros.length > 0 ? (
        <section className="bg-secondary/60 py-16">
          <div className="container-page">
            <SectionHeader
              eyebrow="Rede"
              title="Parceiros"
              action={{ to: "/itnc/parceiros", label: "Todos os parceiros" }}
            />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {parceiros.map((parceiro) => (
                <li
                  key={parceiro.id}
                  className="card-elevated flex items-center gap-4 rounded-xl p-5 transition-shadow hover:shadow-elevated"
                >
                  {parceiro.imagem_url ? (
                    <img
                      src={parceiro.imagem_url}
                      alt={parceiro.titulo}
                      loading="lazy"
                      className="h-9 w-auto max-w-24 shrink-0 object-contain"
                    />
                  ) : (
                    <span className="surface-navy flex size-10 shrink-0 items-center justify-center rounded-lg">
                      <Handshake className="size-5" aria-hidden />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{parceiro.titulo}</p>
                    <p className="text-xs text-muted-foreground">{parceiro.categoria}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* NOTÍCIAS */}
      <section className="container-page py-20">
        <SectionHeader
          eyebrow="Comunicação"
          title="Últimas notícias"
          action={{ to: "/noticias", label: "Todas as notícias" }}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {noticias.length === 0 ? (
            <div className="md:col-span-3">
              <EmptyState message="Nenhuma notícia publicada no momento." />
            </div>
          ) : (
            noticias.map((noticia) => (
              <article
                key={noticia.id}
                className="card-elevated overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-elevated"
              >
                {noticia.imagem_url ? (
                  <img
                    src={noticia.imagem_url}
                    alt={noticia.titulo}
                    loading="lazy"
                    className="h-44 w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                  />
                ) : (
                  <div className="surface-navy flex h-44 items-center justify-center">
                    <FileText className="size-8 opacity-70" aria-hidden />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary">{noticia.categoria}</Badge>
                    <time>{formatDate(noticia.publicado_em)}</time>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold leading-snug">{noticia.titulo}</h3>
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
            ))
          )}
        </div>
      </section>

      {/* EVENTOS */}
      {eventos.length > 0 ? (
        <section className="bg-secondary/60 py-20">
          <div className="container-page">
            <SectionHeader
              eyebrow="Agenda"
              title="Próximos eventos"
              action={{ to: "/eventos", label: "Ver agenda completa" }}
            />
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {eventos.map((evento) => {
                const { dia, mes } = formatDayMonth(evento.inicio);
                return (
                  <article
                    key={evento.id}
                    className="card-elevated flex gap-5 rounded-2xl p-6 transition-shadow duration-300 hover:shadow-elevated"
                  >
                    <div className="surface-navy flex size-16 shrink-0 flex-col items-center justify-center rounded-xl">
                      <span className="font-display text-xl font-bold leading-none">{dia}</span>
                      <span className="mt-1 text-[10px] font-semibold tracking-wider">{mes}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold leading-snug">{evento.titulo}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="size-3.5 shrink-0" aria-hidden />
                        {formatDateTime(evento.inicio)} · {evento.local}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
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
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="container-page py-20">
        <div className="surface-navy grid gap-6 rounded-3xl p-10 md:grid-cols-[1.2fr_auto] md:items-center md:p-14">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">
              Pronto para levar sua ideia ao próximo nível?
            </h2>
            <p className="mt-3 max-w-xl text-primary-foreground/80">
              Fale com a equipe da ITNC e descubra qual programa combina com o momento do seu
              negócio.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="secondary" className="hover-scale">
              <Link to="/contato">
                Fale conosco
                <ExternalLink className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link to="/editais">Ver editais</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
