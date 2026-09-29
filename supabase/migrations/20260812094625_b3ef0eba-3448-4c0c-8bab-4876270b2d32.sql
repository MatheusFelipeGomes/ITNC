CREATE TABLE public.heroes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  titulo text NOT NULL,
  subtitulo text NOT NULL DEFAULT '',
  eyebrow text NOT NULL DEFAULT '',
  imagem_url text,
  cta_primario_label text NOT NULL DEFAULT '',
  cta_primario_url text NOT NULL DEFAULT '',
  cta_secundario_label text NOT NULL DEFAULT '',
  cta_secundario_url text NOT NULL DEFAULT '',
  ordem integer NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true,
  destaque boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'rascunho',
  publicado_em timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.heroes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.heroes TO authenticated;
GRANT ALL ON public.heroes TO service_role;

ALTER TABLE public.heroes ENABLE ROW LEVEL SECURITY;

CREATE POLICY heroes_public_read ON public.heroes FOR SELECT TO anon USING (status = 'publicado' AND ativo = true);
CREATE POLICY heroes_auth_read ON public.heroes FOR SELECT TO authenticated USING (true);
CREATE POLICY heroes_gestor_manage ON public.heroes FOR ALL TO authenticated USING (is_gestor(auth.uid())) WITH CHECK (is_gestor(auth.uid()));

CREATE TRIGGER update_heroes_updated_at BEFORE UPDATE ON public.heroes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.heroes (slug, titulo, subtitulo, eyebrow, cta_primario_label, cta_primario_url, cta_secundario_label, cta_secundario_url, ordem, ativo, destaque, status, publicado_em)
VALUES (
  'guiando-empresas-para-o-futuro',
  'Guiando empresas para o futuro',
  'Transformamos ideias inovadoras em negócios preparados para crescer, gerar impacto e conquistar novos mercados.',
  'Inovação, startups e empreendedorismo',
  'Conheça a ITNC',
  '/itnc/sobre',
  'Confira os editais',
  '/editais',
  1,
  true,
  true,
  'publicado',
  now()
);