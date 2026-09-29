import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  Award,
  Building2,
  CalendarDays,
  FileText,
  GraduationCap,
  Handshake,
  Mail,
  Newspaper,
  Trophy,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { AdminShell } from "@/components/admin/AdminShell";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { supabase } from "@/integrations/supabase/client";
import { formatShortDate } from "@/lib/format";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Dashboard do Gestor — ITNC" },
      { name: "description", content: "Visão geral do conteúdo publicado no site do ITNC." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Dashboard do Gestor — ITNC" },
      { property: "og:description", content: "Gestão de conteúdo institucional do ITNC." },
    ],
  }),
  component: AdminDashboard,
});

interface Atividade {
  id: string;
  autor: string;
  acao: string;
  entidade: string;
  titulo: string;
  created_at: string;
}

function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {

      const agora = new Date().toISOString();

      const [
        noticias,
        noticiasPublicadas,
        editaisAbertos,
        incubadas,
        graduadas,
        eventosProximos,
        parceiros,
        conquistas,
        mensagens,
        indicadores,
      ] = await Promise.all([
        supabase.from("noticias").select("id", { count: "exact", head: true }),
        supabase.from("noticias").select("id", { count: "exact", head: true }).eq("status", "publicado"),
        supabase
          .from("editais")
          .select("id", { count: "exact", head: true })
          .eq("status", "publicado")
          .eq("situacao", "aberto"),
        supabase.from("empresas").select("id", { count: "exact", head: true }).eq("situacao", "incubada"),
        supabase.from("empresas").select("id", { count: "exact", head: true }).eq("situacao", "graduada"),
        supabase.from("eventos").select("id", { count: "exact", head: true }).gte("inicio", agora),
        supabase.from("parceiros").select("id", { count: "exact", head: true }),
        supabase.from("conquistas").select("id", { count: "exact", head: true }),
        supabase.from("contatos").select("id", { count: "exact", head: true }).eq("lida", false),
        supabase
          .from("indicadores")
          .select("titulo,valor,ordem")
          .order("ordem", { ascending: true })
          .limit(6),
      ]);

      return {
        noticias: noticias.count ?? 0,
        noticiasPublicadas: noticiasPublicadas.count ?? 0,
        editaisAbertos: editaisAbertos.count ?? 0,
        incubadas: incubadas.count ?? 0,
        graduadas: graduadas.count ?? 0,
        eventosProximos: eventosProximos.count ?? 0,
        parceiros: parceiros.count ?? 0,
        conquistas: conquistas.count ?? 0,
        mensagens: mensagens.count ?? 0,
        grafico: (indicadores.data ?? [])
          .map((item) => ({
            nome: item.titulo,
            valor: Number(String(item.valor).replace(/[^0-9,.-]/g, "").replace(",", ".")),
          }))
          .filter((item) => Number.isFinite(item.valor) && item.valor > 0),
      };
    },
  });

  const atividades = useQuery({
    queryKey: ["admin", "atividades"],
    queryFn: async (): Promise<Atividade[]> => {
      const { data, error } = await supabase
        .from("atividades")
        .select("id,autor,acao,entidade,titulo,created_at")
        .order("created_at", { ascending: false })
        .limit(12);
      if (error) throw error;
      return (data ?? []) as Atividade[];
    },
  });

  const cards = [
    { to: "/admin/noticias", label: "Notícias no total", value: data?.noticias ?? 0, icon: Newspaper },
    {
      to: "/admin/noticias",
      label: "Notícias publicadas",
      value: data?.noticiasPublicadas ?? 0,
      icon: Newspaper,
    },
    { to: "/admin/editais", label: "Editais abertos", value: data?.editaisAbertos ?? 0, icon: FileText },
    { to: "/admin/empresas", label: "Empresas incubadas", value: data?.incubadas ?? 0, icon: Building2 },
    {
      to: "/admin/empresas",
      label: "Empresas graduadas",
      value: data?.graduadas ?? 0,
      icon: GraduationCap,
    },
    {
      to: "/admin/eventos",
      label: "Eventos próximos",
      value: data?.eventosProximos ?? 0,
      icon: CalendarDays,
    },
    { to: "/admin/parceiros", label: "Parceiros", value: data?.parceiros ?? 0, icon: Handshake },
    { to: "/admin/conquistas", label: "Conquistas", value: data?.conquistas ?? 0, icon: Trophy },
    { to: "/admin/mensagens", label: "Mensagens não lidas", value: data?.mensagens ?? 0, icon: Mail },
  ] as const;

  return (
    <AdminShell title="Dashboard" description="Resumo do conteúdo publicado e das últimas ações.">
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.label}
              to={card.to}
              className="rounded-xl border border-border bg-background p-5 transition-shadow hover:shadow-md"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-secondary">
                <card.icon className="size-5" aria-hidden />
              </span>
              <p className="mt-4 font-display text-3xl font-bold">{card.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-5">
        <section className="rounded-xl border border-border bg-background p-6 lg:col-span-3">
          <h2 className="font-display text-lg font-semibold">Indicadores de resultados</h2>
          {(data?.grafico ?? []).length === 0 ? (
            <div className="py-14 text-center">
              <Award className="mx-auto size-8 text-muted-foreground" aria-hidden />
              <p className="mt-3 text-sm font-medium">Sem dados numéricos ainda</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Cadastre indicadores com valores numéricos em Resultados para ver o gráfico.
              </p>
            </div>
          ) : (
            <ChartContainer
              config={{ valor: { label: "Valor", color: "hsl(var(--primary))" } }}
              className="mt-4 h-72 w-full"
            >
              <BarChart data={data!.grafico}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="nome" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="valor" fill="var(--color-valor)" radius={6} />
              </BarChart>
            </ChartContainer>
          )}
        </section>

        <section className="rounded-xl border border-border bg-background p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Atividade recente</h2>
          {atividades.isLoading ? (
            <div className="mt-4 space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          ) : (atividades.data ?? []).length === 0 ? (
            <div className="py-12 text-center">
              <Activity className="mx-auto size-8 text-muted-foreground" aria-hidden />
              <p className="mt-3 text-sm font-medium">Nenhuma ação registrada</p>
              <p className="mt-1 text-sm text-muted-foreground">
                As alterações feitas no painel aparecem aqui.
              </p>
            </div>
          ) : (
            <ul className="mt-4 space-y-4">
              {atividades.data!.map((item) => (
                <li key={item.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                  <p className="text-sm">
                    <span className="font-medium">{item.autor}</span> {item.acao}{" "}
                    <span className="text-muted-foreground">{item.entidade}</span>
                    {item.titulo ? `: ${item.titulo}` : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatShortDate(item.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
