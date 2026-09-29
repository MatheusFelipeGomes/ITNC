-- EQUIPE
CREATE TABLE public.equipe (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  titulo text NOT NULL,
  cargo text NOT NULL DEFAULT '',
  area text NOT NULL DEFAULT '',
  resumo text NOT NULL DEFAULT '',
  conteudo text NOT NULL DEFAULT '',
  imagem_url text,
  email text NOT NULL DEFAULT '',
  linkedin_url text NOT NULL DEFAULT '',
  ordem integer NOT NULL DEFAULT 0,
  destaque boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'rascunho',
  publicado_em timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.equipe TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.equipe TO authenticated;
GRANT ALL ON public.equipe TO service_role;
ALTER TABLE public.equipe ENABLE ROW LEVEL SECURITY;
CREATE POLICY equipe_public_read ON public.equipe FOR SELECT TO anon USING (status = 'publicado');
CREATE POLICY equipe_auth_read ON public.equipe FOR SELECT TO authenticated USING (true);
CREATE POLICY equipe_gestor_manage ON public.equipe FOR ALL TO authenticated
  USING (public.is_gestor(auth.uid())) WITH CHECK (public.is_gestor(auth.uid()));
CREATE TRIGGER update_equipe_updated_at BEFORE UPDATE ON public.equipe
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CONFIGURACOES
CREATE TABLE public.configuracoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chave text NOT NULL UNIQUE,
  valor jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.configuracoes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.configuracoes TO authenticated;
GRANT ALL ON public.configuracoes TO service_role;
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY configuracoes_public_read ON public.configuracoes FOR SELECT TO anon USING (true);
CREATE POLICY configuracoes_auth_read ON public.configuracoes FOR SELECT TO authenticated USING (true);
CREATE POLICY configuracoes_gestor_manage ON public.configuracoes FOR ALL TO authenticated
  USING (public.is_gestor(auth.uid())) WITH CHECK (public.is_gestor(auth.uid()));
CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON public.configuracoes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.configuracoes (chave, valor) VALUES
  ('institucional', '{"nome":"ITNC","descricao":"Incubadora de Tecnologia e Negócios Criativos","email":"contato@itnc.org.br","telefone":"","whatsapp":"","endereco":"","cnpj":"","horario":""}'::jsonb),
  ('redes_sociais', '{"instagram":"","linkedin":"","facebook":"","youtube":"","x":""}'::jsonb),
  ('seo', '{"titulo_padrao":"ITNC — Incubadora de Inovação","descricao_padrao":"Guiando empresas para o futuro.","palavras_chave":"incubadora, inovação, startups","og_imagem":""}'::jsonb),
  ('geral', '{"manutencao":false,"exibir_eventos":true,"exibir_editais":true,"itens_por_pagina":10}'::jsonb);

-- ATIVIDADES
CREATE TABLE public.atividades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  autor text NOT NULL DEFAULT '',
  acao text NOT NULL,
  entidade text NOT NULL,
  registro_id uuid,
  titulo text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.atividades TO authenticated;
GRANT ALL ON public.atividades TO service_role;
ALTER TABLE public.atividades ENABLE ROW LEVEL SECURITY;
CREATE POLICY atividades_auth_read ON public.atividades FOR SELECT TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.log_atividade()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_autor text := '';
  v_row record;
  v_acao text;
BEGIN
  SELECT COALESCE(NULLIF(p.nome, ''), p.email, 'Sistema') INTO v_autor
  FROM public.profiles p WHERE p.id = auth.uid();

  IF TG_OP = 'DELETE' THEN
    v_row := OLD; v_acao := 'removeu';
  ELSIF TG_OP = 'INSERT' THEN
    v_row := NEW; v_acao := 'criou';
  ELSE
    v_row := NEW; v_acao := 'atualizou';
  END IF;

  INSERT INTO public.atividades (user_id, autor, acao, entidade, registro_id, titulo)
  VALUES (auth.uid(), COALESCE(v_autor, 'Sistema'), v_acao, TG_TABLE_NAME, v_row.id, COALESCE(v_row.titulo, ''));

  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER log_noticias AFTER INSERT OR UPDATE OR DELETE ON public.noticias FOR EACH ROW EXECUTE FUNCTION public.log_atividade();
CREATE TRIGGER log_editais AFTER INSERT OR UPDATE OR DELETE ON public.editais FOR EACH ROW EXECUTE FUNCTION public.log_atividade();
CREATE TRIGGER log_eventos AFTER INSERT OR UPDATE OR DELETE ON public.eventos FOR EACH ROW EXECUTE FUNCTION public.log_atividade();
CREATE TRIGGER log_empresas AFTER INSERT OR UPDATE OR DELETE ON public.empresas FOR EACH ROW EXECUTE FUNCTION public.log_atividade();
CREATE TRIGGER log_parceiros AFTER INSERT OR UPDATE OR DELETE ON public.parceiros FOR EACH ROW EXECUTE FUNCTION public.log_atividade();
CREATE TRIGGER log_conquistas AFTER INSERT OR UPDATE OR DELETE ON public.conquistas FOR EACH ROW EXECUTE FUNCTION public.log_atividade();
CREATE TRIGGER log_indicadores AFTER INSERT OR UPDATE OR DELETE ON public.indicadores FOR EACH ROW EXECUTE FUNCTION public.log_atividade();
CREATE TRIGGER log_paginas AFTER INSERT OR UPDATE OR DELETE ON public.paginas FOR EACH ROW EXECUTE FUNCTION public.log_atividade();
CREATE TRIGGER log_heroes AFTER INSERT OR UPDATE OR DELETE ON public.heroes FOR EACH ROW EXECUTE FUNCTION public.log_atividade();
CREATE TRIGGER log_equipe AFTER INSERT OR UPDATE OR DELETE ON public.equipe FOR EACH ROW EXECUTE FUNCTION public.log_atividade();