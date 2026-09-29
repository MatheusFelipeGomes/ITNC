import { createServerFn } from "@tanstack/react-start";

export interface NoticiaResumo {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  imagem_url: string | null;
  categoria: string;
  destaque: boolean;
  publicado_em: string | null;
}

export interface NoticiaDetalhe extends NoticiaResumo {
  conteudo: string;
}

export interface EditalResumo {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  situacao: string;
  inscricoes_inicio: string | null;
  inscricoes_fim: string | null;
  publicado_em: string | null;
}

export interface EditalDetalhe extends EditalResumo {
  conteudo: string;
  arquivo_url: string | null;
}

export interface EventoResumo {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  imagem_url: string | null;
  local: string;
  inicio: string | null;
  fim: string | null;
}

export interface EventoDetalhe extends EventoResumo {
  conteudo: string;
  inscricao_url: string | null;
}

const NOTICIA_COLS = "id,slug,titulo,resumo,imagem_url,categoria,destaque,publicado_em";
const EDITAL_COLS = "id,slug,titulo,resumo,situacao,inscricoes_inicio,inscricoes_fim,publicado_em";
const EVENTO_COLS = "id,slug,titulo,resumo,imagem_url,local,inicio,fim";

function validateSlug(input: unknown): { slug: string } {
  const slug = (input as { slug?: unknown })?.slug;
  if (typeof slug !== "string" || slug.length === 0 || slug.length > 120) {
    throw new Error("Endereço inválido");
  }
  return { slug };
}

export const listNoticias = createServerFn({ method: "GET" }).handler(async () => {
  const { publicSupabase, resolveMedia } = await import("./public-supabase.server");
  const { data, error } = await publicSupabase()
    .from("noticias")
    .select(NOTICIA_COLS)
    .eq("status", "publicado")
    .order("publicado_em", { ascending: false });
  if (error) throw new Error(error.message);
  return resolveMedia((data ?? []) as unknown as NoticiaResumo[], ["imagem_url"]);
});

export const getNoticia = createServerFn({ method: "GET" })
  .inputValidator(validateSlug)
  .handler(async ({ data: input }) => {
    const { publicSupabase, resolveMedia } = await import("./public-supabase.server");
    const { data, error } = await publicSupabase()
      .from("noticias")
      .select(`${NOTICIA_COLS},conteudo`)
      .eq("status", "publicado")
      .eq("slug", input.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    const [row] = await resolveMedia([data as unknown as NoticiaDetalhe], ["imagem_url"]);
    return row!;
  });

export const listEditais = createServerFn({ method: "GET" }).handler(async () => {
  const { publicSupabase } = await import("./public-supabase.server");
  const { data, error } = await publicSupabase()
    .from("editais")
    .select(EDITAL_COLS)
    .eq("status", "publicado")
    .order("publicado_em", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as EditalResumo[];
});

export const getEdital = createServerFn({ method: "GET" })
  .inputValidator(validateSlug)
  .handler(async ({ data: input }) => {
    const { publicSupabase, resolveMedia } = await import("./public-supabase.server");
    const { data, error } = await publicSupabase()
      .from("editais")
      .select(`${EDITAL_COLS},conteudo,arquivo_url`)
      .eq("status", "publicado")
      .eq("slug", input.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    const [row] = await resolveMedia([data as unknown as EditalDetalhe], ["arquivo_url"]);
    return row!;
  });

export const listEventos = createServerFn({ method: "GET" }).handler(async () => {
  const { publicSupabase, resolveMedia } = await import("./public-supabase.server");
  const { data, error } = await publicSupabase()
    .from("eventos")
    .select(EVENTO_COLS)
    .eq("status", "publicado")
    .order("inicio", { ascending: true });
  if (error) throw new Error(error.message);
  return resolveMedia((data ?? []) as unknown as EventoResumo[], ["imagem_url"]);
});

export const getEvento = createServerFn({ method: "GET" })
  .inputValidator(validateSlug)
  .handler(async ({ data: input }) => {
    const { publicSupabase, resolveMedia } = await import("./public-supabase.server");
    const { data, error } = await publicSupabase()
      .from("eventos")
      .select(`${EVENTO_COLS},conteudo,inscricao_url`)
      .eq("status", "publicado")
      .eq("slug", input.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    const [row] = await resolveMedia([data as unknown as EventoDetalhe], ["imagem_url"]);
    return row!;
  });

export const getHomeContent = createServerFn({ method: "GET" }).handler(async () => {
  const { publicSupabase, resolveMedia } = await import("./public-supabase.server");
  const client = publicSupabase();

  const [noticias, editais, eventos] = await Promise.all([
    client
      .from("noticias")
      .select(NOTICIA_COLS)
      .eq("status", "publicado")
      .order("publicado_em", { ascending: false })
      .limit(3),
    client
      .from("editais")
      .select(EDITAL_COLS)
      .eq("status", "publicado")
      .order("publicado_em", { ascending: false })
      .limit(3),
    client
      .from("eventos")
      .select(EVENTO_COLS)
      .eq("status", "publicado")
      .order("inicio", { ascending: true })
      .limit(2),
  ]);

  return {
    noticias: await resolveMedia((noticias.data ?? []) as unknown as NoticiaResumo[], ["imagem_url"]),
    editais: (editais.data ?? []) as unknown as EditalResumo[],
    eventos: await resolveMedia((eventos.data ?? []) as unknown as EventoResumo[], ["imagem_url"]),
  };
});

/* ------------------------------------------------------------------ *
 * Conteúdos institucionais administráveis
 * ------------------------------------------------------------------ */

export interface EmpresaResumo {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  imagem_url: string | null;
  site_url: string | null;
  setor: string;
  ano_ingresso: number | null;
  situacao: string;
  destaque: boolean;
}

export interface EmpresaDetalhe extends EmpresaResumo {
  conteudo: string;
}

export interface ParceiroResumo {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  imagem_url: string | null;
  site_url: string | null;
  categoria: string;
  destaque: boolean;
}

export interface ConquistaResumo {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  imagem_url: string | null;
  ano: number | null;
  categoria: string;
  destaque: boolean;
}

export interface IndicadorResumo {
  id: string;
  slug: string;
  titulo: string;
  valor: string;
  resumo: string;
  ordem: number;
}

export interface PaginaConteudo {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  imagem_url: string | null;
}

const EMPRESA_COLS =
  "id,slug,titulo,resumo,imagem_url,site_url,setor,ano_ingresso,situacao,destaque";
const PARCEIRO_COLS = "id,slug,titulo,resumo,imagem_url,site_url,categoria,destaque";
const CONQUISTA_COLS = "id,slug,titulo,resumo,imagem_url,ano,categoria,destaque";
const INDICADOR_COLS = "id,slug,titulo,valor,resumo,ordem";
const PAGINA_COLS = "id,slug,titulo,resumo,conteudo,imagem_url";

export const listEmpresas = createServerFn({ method: "GET" }).handler(async () => {
  const { publicSupabase, resolveMedia } = await import("./public-supabase.server");
  const { data, error } = await publicSupabase()
    .from("empresas")
    .select(EMPRESA_COLS)
    .eq("status", "publicado")
    .order("titulo", { ascending: true });
  if (error) throw new Error(error.message);
  return resolveMedia((data ?? []) as unknown as EmpresaResumo[], ["imagem_url"]);
});

export const getEmpresa = createServerFn({ method: "GET" })
  .inputValidator(validateSlug)
  .handler(async ({ data: input }) => {
    const { publicSupabase, resolveMedia } = await import("./public-supabase.server");
    const { data, error } = await publicSupabase()
      .from("empresas")
      .select(`${EMPRESA_COLS},conteudo`)
      .eq("status", "publicado")
      .eq("slug", input.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    const [row] = await resolveMedia([data as unknown as EmpresaDetalhe], ["imagem_url"]);
    return row!;
  });

export const listParceiros = createServerFn({ method: "GET" }).handler(async () => {
  const { publicSupabase, resolveMedia } = await import("./public-supabase.server");
  const { data, error } = await publicSupabase()
    .from("parceiros")
    .select(PARCEIRO_COLS)
    .eq("status", "publicado")
    .order("titulo", { ascending: true });
  if (error) throw new Error(error.message);
  return resolveMedia((data ?? []) as unknown as ParceiroResumo[], ["imagem_url"]);
});

export const listConquistas = createServerFn({ method: "GET" }).handler(async () => {
  const { publicSupabase, resolveMedia } = await import("./public-supabase.server");
  const { data, error } = await publicSupabase()
    .from("conquistas")
    .select(CONQUISTA_COLS)
    .eq("status", "publicado")
    .order("ano", { ascending: false });
  if (error) throw new Error(error.message);
  return resolveMedia((data ?? []) as unknown as ConquistaResumo[], ["imagem_url"]);
});

export const listIndicadores = createServerFn({ method: "GET" }).handler(async () => {
  const { publicSupabase } = await import("./public-supabase.server");
  const { data, error } = await publicSupabase()
    .from("indicadores")
    .select(INDICADOR_COLS)
    .eq("status", "publicado")
    .order("ordem", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as IndicadorResumo[];
});

export const getPagina = createServerFn({ method: "GET" })
  .inputValidator(validateSlug)
  .handler(async ({ data: input }) => {
    const { publicSupabase, resolveMedia } = await import("./public-supabase.server");
    const { data, error } = await publicSupabase()
      .from("paginas")
      .select(PAGINA_COLS)
      .eq("status", "publicado")
      .eq("slug", input.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    const [row] = await resolveMedia([data as unknown as PaginaConteudo], ["imagem_url"]);
    return row!;
  });

export interface HeroConteudo {
  id: string;
  slug: string;
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  imagem_url: string | null;
  cta_primario_label: string;
  cta_primario_url: string;
  cta_secundario_label: string;
  cta_secundario_url: string;
  ordem: number;
  destaque: boolean;
}

export const HERO_COLS =
  "id,slug,eyebrow,titulo,subtitulo,imagem_url,cta_primario_label,cta_primario_url,cta_secundario_label,cta_secundario_url,ordem,destaque";

export interface HomePayload {
  hero: HeroConteudo | null;
  sobre: PaginaConteudo | null;
  incubacao: PaginaConteudo | null;
  resultados: PaginaConteudo | null;
  indicadores: IndicadorResumo[];
  empresas: EmpresaResumo[];
  parceiros: ParceiroResumo[];
  conquistas: ConquistaResumo[];
  noticias: NoticiaResumo[];
  editais: EditalResumo[];
  eventos: EventoResumo[];
}

export const getHomePayload = createServerFn({ method: "GET" }).handler(async () => {
  const { publicSupabase, resolveMedia } = await import("./public-supabase.server");
  const client = publicSupabase();

  const [heroes, paginas, indicadores, empresas, parceiros, conquistas, noticias, editais, eventos] =
    await Promise.all([
      client
        .from("heroes")
        .select(HERO_COLS)
        .eq("status", "publicado")
        .eq("ativo", true)
        .order("destaque", { ascending: false })
        .order("ordem", { ascending: true })
        .limit(1),
      client
        .from("paginas")
        .select(PAGINA_COLS)
        .eq("status", "publicado")
        .in("slug", ["sobre", "incubacao", "resultados"]),
      client
        .from("indicadores")
        .select(INDICADOR_COLS)
        .eq("status", "publicado")
        .eq("destaque", true)
        .order("ordem", { ascending: true })
        .limit(4),
      client
        .from("empresas")
        .select(EMPRESA_COLS)
        .eq("status", "publicado")
        .eq("destaque", true)
        .order("titulo", { ascending: true })
        .limit(6),
      client
        .from("parceiros")
        .select(PARCEIRO_COLS)
        .eq("status", "publicado")
        .eq("destaque", true)
        .order("titulo", { ascending: true })
        .limit(8),
      client
        .from("conquistas")
        .select(CONQUISTA_COLS)
        .eq("status", "publicado")
        .eq("destaque", true)
        .order("ano", { ascending: false })
        .limit(3),
      client
        .from("noticias")
        .select(NOTICIA_COLS)
        .eq("status", "publicado")
        .order("publicado_em", { ascending: false })
        .limit(3),
      client
        .from("editais")
        .select(EDITAL_COLS)
        .eq("status", "publicado")
        .order("publicado_em", { ascending: false })
        .limit(3),
      client
        .from("eventos")
        .select(EVENTO_COLS)
        .eq("status", "publicado")
        .order("inicio", { ascending: true })
        .limit(2),
    ]);

  const pages = (paginas.data ?? []) as unknown as PaginaConteudo[];
  const bySlug = (slug: string) => pages.find((p) => p.slug === slug) ?? null;

  const heroRows = await resolveMedia((heroes.data ?? []) as unknown as HeroConteudo[], [
    "imagem_url",
  ]);

  const payload: HomePayload = {
    hero: heroRows[0] ?? null,
    sobre: bySlug("sobre"),
    incubacao: bySlug("incubacao"),
    resultados: bySlug("resultados"),
    indicadores: (indicadores.data ?? []) as unknown as IndicadorResumo[],
    empresas: await resolveMedia((empresas.data ?? []) as unknown as EmpresaResumo[], ["imagem_url"]),
    parceiros: await resolveMedia((parceiros.data ?? []) as unknown as ParceiroResumo[], ["imagem_url"]),
    conquistas: await resolveMedia((conquistas.data ?? []) as unknown as ConquistaResumo[], ["imagem_url"]),
    noticias: await resolveMedia((noticias.data ?? []) as unknown as NoticiaResumo[], ["imagem_url"]),
    editais: (editais.data ?? []) as unknown as EditalResumo[],
    eventos: await resolveMedia((eventos.data ?? []) as unknown as EventoResumo[], ["imagem_url"]),
  };

  return payload;
});
