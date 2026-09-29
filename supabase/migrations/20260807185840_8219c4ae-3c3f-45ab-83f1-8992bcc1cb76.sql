-- helpers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

-- roles
CREATE TYPE public.app_role AS ENUM ('admin','editor');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_auth" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_gestor(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id);
$$;

CREATE POLICY "user_roles_select_auth" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "user_roles_admin_manage" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', ''), COALESCE(NEW.email, ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- noticias
CREATE TABLE public.noticias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  titulo TEXT NOT NULL,
  resumo TEXT NOT NULL DEFAULT '',
  conteudo TEXT NOT NULL DEFAULT '',
  imagem_url TEXT,
  categoria TEXT NOT NULL DEFAULT 'Institucional',
  destaque BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'rascunho',
  publicado_em TIMESTAMPTZ,
  autor_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.noticias TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.noticias TO authenticated;
GRANT ALL ON public.noticias TO service_role;
ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "noticias_public_read" ON public.noticias FOR SELECT TO anon USING (status = 'publicado');
CREATE POLICY "noticias_auth_read" ON public.noticias FOR SELECT TO authenticated USING (true);
CREATE POLICY "noticias_gestor_manage" ON public.noticias FOR ALL TO authenticated
  USING (public.is_gestor(auth.uid())) WITH CHECK (public.is_gestor(auth.uid()));
CREATE TRIGGER trg_noticias_updated BEFORE UPDATE ON public.noticias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- editais
CREATE TABLE public.editais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  titulo TEXT NOT NULL,
  resumo TEXT NOT NULL DEFAULT '',
  conteudo TEXT NOT NULL DEFAULT '',
  arquivo_url TEXT,
  inscricoes_inicio DATE,
  inscricoes_fim DATE,
  situacao TEXT NOT NULL DEFAULT 'aberto',
  status TEXT NOT NULL DEFAULT 'rascunho',
  publicado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.editais TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.editais TO authenticated;
GRANT ALL ON public.editais TO service_role;
ALTER TABLE public.editais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "editais_public_read" ON public.editais FOR SELECT TO anon USING (status = 'publicado');
CREATE POLICY "editais_auth_read" ON public.editais FOR SELECT TO authenticated USING (true);
CREATE POLICY "editais_gestor_manage" ON public.editais FOR ALL TO authenticated
  USING (public.is_gestor(auth.uid())) WITH CHECK (public.is_gestor(auth.uid()));
CREATE TRIGGER trg_editais_updated BEFORE UPDATE ON public.editais FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- eventos
CREATE TABLE public.eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  titulo TEXT NOT NULL,
  resumo TEXT NOT NULL DEFAULT '',
  conteudo TEXT NOT NULL DEFAULT '',
  imagem_url TEXT,
  local TEXT NOT NULL DEFAULT '',
  inicio TIMESTAMPTZ,
  fim TIMESTAMPTZ,
  inscricao_url TEXT,
  status TEXT NOT NULL DEFAULT 'rascunho',
  publicado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.eventos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.eventos TO authenticated;
GRANT ALL ON public.eventos TO service_role;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "eventos_public_read" ON public.eventos FOR SELECT TO anon USING (status = 'publicado');
CREATE POLICY "eventos_auth_read" ON public.eventos FOR SELECT TO authenticated USING (true);
CREATE POLICY "eventos_gestor_manage" ON public.eventos FOR ALL TO authenticated
  USING (public.is_gestor(auth.uid())) WITH CHECK (public.is_gestor(auth.uid()));
CREATE TRIGGER trg_eventos_updated BEFORE UPDATE ON public.eventos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- contatos
CREATE TABLE public.contatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  assunto TEXT NOT NULL DEFAULT '',
  mensagem TEXT NOT NULL,
  lida BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contatos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contatos TO authenticated;
GRANT ALL ON public.contatos TO service_role;
ALTER TABLE public.contatos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contatos_public_insert" ON public.contatos FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "contatos_gestor_manage" ON public.contatos FOR ALL TO authenticated
  USING (public.is_gestor(auth.uid())) WITH CHECK (public.is_gestor(auth.uid()));
CREATE TRIGGER trg_contatos_updated BEFORE UPDATE ON public.contatos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- conteudo de exemplo
INSERT INTO public.noticias (slug, titulo, resumo, conteudo, categoria, destaque, status, publicado_em) VALUES
('itnc-abre-inscricoes-para-nova-turma-de-incubacao','ITNC abre inscrições para nova turma de incubação','Startups de base tecnológica podem se inscrever no programa de pré-incubação e incubação.','O Instituto de Tecnologia e Negócios Criativos (ITNC) anuncia a abertura das inscrições para a nova turma do programa de incubação. Serão selecionadas até 12 startups de base tecnológica, que receberão mentoria, espaço físico, apoio jurídico e acesso à rede de investidores.

As inscrições podem ser feitas de forma totalmente online e o processo seletivo contempla análise documental, pitch e entrevista técnica.','Editais',true,'publicado',now() - interval '2 days'),
('empresas-incubadas-somam-r-12-milhoes-em-faturamento','Empresas incubadas somam R$ 12 milhões em faturamento','Resultado consolidado do último ciclo mostra crescimento de 38% no faturamento das incubadas.','As empresas apoiadas pela incubadora registraram faturamento conjunto de R$ 12 milhões no último ciclo, um crescimento de 38% em relação ao período anterior. O desempenho é resultado do trabalho contínuo de aceleração comercial, capacitação em gestão e acesso a mercado.','Resultados',false,'publicado',now() - interval '9 days'),
('hdi-recebe-missao-de-inovacao-internacional','HDI recebe missão de inovação internacional','Delegação visitou o Hub de Desenvolvimento e Inovação para conhecer o ecossistema local.','O Hub de Desenvolvimento e Inovação (HDI) recebeu uma missão internacional composta por gestores de parques tecnológicos e investidores. A agenda incluiu rodadas de negócio, visitas técnicas aos laboratórios e apresentação das empresas incubadas.','Institucional',false,'publicado',now() - interval '21 days');

INSERT INTO public.editais (slug, titulo, resumo, conteudo, inscricoes_inicio, inscricoes_fim, situacao, status, publicado_em) VALUES
('edital-01-2026-incubacao-de-startups','Edital 01/2026 — Incubação de Startups','Seleção de até 12 startups de base tecnológica para o programa de incubação.','O presente edital estabelece as normas para seleção de startups de base tecnológica interessadas em ingressar no programa de incubação. São oferecidos espaço de trabalho, mentorias especializadas, apoio na proteção da propriedade intelectual e conexão com investidores.

As etapas do processo seletivo são: inscrição online, análise de mérito, pitch presencial e divulgação do resultado final.', CURRENT_DATE - 10, CURRENT_DATE + 25,'aberto','publicado',now() - interval '10 days'),
('edital-02-2026-pre-incubacao','Edital 02/2026 — Pré-incubação','Apoio à validação de ideias e modelagem de negócio em estágio inicial.','Voltado a equipes com ideias validadas em estágio inicial, o programa de pré-incubação oferece trilha de capacitação em modelagem de negócio, validação de mercado e construção de MVP, com acompanhamento de mentores por 6 meses.', CURRENT_DATE + 15, CURRENT_DATE + 60,'em_breve','publicado',now() - interval '3 days'),
('edital-05-2025-inovacao-aberta','Edital 05/2025 — Inovação Aberta','Conexão entre desafios de empresas parceiras e soluções de startups.','Edital encerrado de inovação aberta, que conectou desafios reais de empresas parceiras a soluções desenvolvidas por startups do ecossistema. Foram submetidas 84 propostas e selecionadas 9 soluções.', CURRENT_DATE - 180, CURRENT_DATE - 120,'encerrado','publicado',now() - interval '180 days');

INSERT INTO public.eventos (slug, titulo, resumo, conteudo, local, inicio, fim, status, publicado_em) VALUES
('demoday-2026-startups-incubadas','DemoDay 2026 — Startups Incubadas','Apresentação pública das startups formadas no ciclo 2025/2026.','O DemoDay é o evento de encerramento do ciclo de incubação, no qual as startups apresentam seus resultados, métricas e planos de crescimento para investidores, parceiros e imprensa.','Auditório do ITNC', now() + interval '18 days', now() + interval '18 days 5 hours','publicado',now() - interval '5 days'),
('workshop-propriedade-intelectual','Workshop de Propriedade Intelectual','Como proteger a inovação da sua empresa: patentes, marcas e software.','Workshop prático sobre proteção da propriedade intelectual para empreendedores de base tecnológica, abordando registro de marcas, depósito de patentes e registro de programas de computador.','Sala de Inovação — HDI', now() + interval '32 days', now() + interval '32 days 3 hours','publicado',now() - interval '1 day');