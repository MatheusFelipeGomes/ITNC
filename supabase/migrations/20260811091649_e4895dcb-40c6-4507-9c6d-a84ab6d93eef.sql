-- EMPRESAS
CREATE TABLE public.empresas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  titulo text NOT NULL,
  resumo text NOT NULL DEFAULT '',
  conteudo text NOT NULL DEFAULT '',
  imagem_url text,
  site_url text,
  setor text NOT NULL DEFAULT '',
  ano_ingresso integer,
  situacao text NOT NULL DEFAULT 'incubada',
  destaque boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'rascunho',
  publicado_em timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.empresas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.empresas TO authenticated;
GRANT ALL ON public.empresas TO service_role;
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
CREATE POLICY empresas_public_read ON public.empresas FOR SELECT TO anon USING (status = 'publicado');
CREATE POLICY empresas_auth_read ON public.empresas FOR SELECT TO authenticated USING (true);
CREATE POLICY empresas_gestor_manage ON public.empresas FOR ALL TO authenticated USING (public.is_gestor(auth.uid())) WITH CHECK (public.is_gestor(auth.uid()));
CREATE TRIGGER trg_empresas_updated BEFORE UPDATE ON public.empresas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PARCEIROS
CREATE TABLE public.parceiros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  titulo text NOT NULL,
  resumo text NOT NULL DEFAULT '',
  imagem_url text,
  site_url text,
  categoria text NOT NULL DEFAULT 'Institucional',
  destaque boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'rascunho',
  publicado_em timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.parceiros TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.parceiros TO authenticated;
GRANT ALL ON public.parceiros TO service_role;
ALTER TABLE public.parceiros ENABLE ROW LEVEL SECURITY;
CREATE POLICY parceiros_public_read ON public.parceiros FOR SELECT TO anon USING (status = 'publicado');
CREATE POLICY parceiros_auth_read ON public.parceiros FOR SELECT TO authenticated USING (true);
CREATE POLICY parceiros_gestor_manage ON public.parceiros FOR ALL TO authenticated USING (public.is_gestor(auth.uid())) WITH CHECK (public.is_gestor(auth.uid()));
CREATE TRIGGER trg_parceiros_updated BEFORE UPDATE ON public.parceiros FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CONQUISTAS
CREATE TABLE public.conquistas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  titulo text NOT NULL,
  resumo text NOT NULL DEFAULT '',
  conteudo text NOT NULL DEFAULT '',
  imagem_url text,
  ano integer,
  categoria text NOT NULL DEFAULT 'Premiação',
  destaque boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'rascunho',
  publicado_em timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.conquistas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conquistas TO authenticated;
GRANT ALL ON public.conquistas TO service_role;
ALTER TABLE public.conquistas ENABLE ROW LEVEL SECURITY;
CREATE POLICY conquistas_public_read ON public.conquistas FOR SELECT TO anon USING (status = 'publicado');
CREATE POLICY conquistas_auth_read ON public.conquistas FOR SELECT TO authenticated USING (true);
CREATE POLICY conquistas_gestor_manage ON public.conquistas FOR ALL TO authenticated USING (public.is_gestor(auth.uid())) WITH CHECK (public.is_gestor(auth.uid()));
CREATE TRIGGER trg_conquistas_updated BEFORE UPDATE ON public.conquistas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- INDICADORES
CREATE TABLE public.indicadores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  titulo text NOT NULL,
  valor text NOT NULL DEFAULT '',
  resumo text NOT NULL DEFAULT '',
  ordem integer NOT NULL DEFAULT 0,
  destaque boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'rascunho',
  publicado_em timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.indicadores TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.indicadores TO authenticated;
GRANT ALL ON public.indicadores TO service_role;
ALTER TABLE public.indicadores ENABLE ROW LEVEL SECURITY;
CREATE POLICY indicadores_public_read ON public.indicadores FOR SELECT TO anon USING (status = 'publicado');
CREATE POLICY indicadores_auth_read ON public.indicadores FOR SELECT TO authenticated USING (true);
CREATE POLICY indicadores_gestor_manage ON public.indicadores FOR ALL TO authenticated USING (public.is_gestor(auth.uid())) WITH CHECK (public.is_gestor(auth.uid()));
CREATE TRIGGER trg_indicadores_updated BEFORE UPDATE ON public.indicadores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PAGINAS INSTITUCIONAIS
CREATE TABLE public.paginas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  titulo text NOT NULL,
  resumo text NOT NULL DEFAULT '',
  conteudo text NOT NULL DEFAULT '',
  imagem_url text,
  status text NOT NULL DEFAULT 'rascunho',
  publicado_em timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.paginas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.paginas TO authenticated;
GRANT ALL ON public.paginas TO service_role;
ALTER TABLE public.paginas ENABLE ROW LEVEL SECURITY;
CREATE POLICY paginas_public_read ON public.paginas FOR SELECT TO anon USING (status = 'publicado');
CREATE POLICY paginas_auth_read ON public.paginas FOR SELECT TO authenticated USING (true);
CREATE POLICY paginas_gestor_manage ON public.paginas FOR ALL TO authenticated USING (public.is_gestor(auth.uid())) WITH CHECK (public.is_gestor(auth.uid()));
CREATE TRIGGER trg_paginas_updated BEFORE UPDATE ON public.paginas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SEED
INSERT INTO public.indicadores (slug, titulo, valor, resumo, ordem, status, publicado_em) VALUES
  ('empresas-incubadas', 'Empresas incubadas', '48', 'Startups apoiadas desde a criação da ITNC.', 1, 'publicado', now()),
  ('faturamento', 'Faturamento das incubadas', 'R$ 12 mi', 'Receita somada das empresas apoiadas no último ciclo.', 2, 'publicado', now()),
  ('empregos', 'Empregos gerados', '320', 'Postos de trabalho qualificados criados pelo ecossistema.', 3, 'publicado', now()),
  ('parceiros', 'Parceiros ativos', '27', 'Instituições, empresas e investidores conectados.', 4, 'publicado', now());

INSERT INTO public.paginas (slug, titulo, resumo, conteudo, status, publicado_em) VALUES
  ('sobre', 'Sobre a ITNC', 'Somos a incubadora de empresas de base tecnológica que conecta pesquisa, mercado e empreendedorismo.', 'A ITNC nasceu para transformar conhecimento em negócios sustentáveis, apoiando empreendedores com infraestrutura, mentoria e acesso a mercado.

Atuamos em toda a jornada empreendedora: da validação da ideia à consolidação da empresa no mercado, sempre em parceria com universidades, poder público e iniciativa privada.

Nossa missão é fortalecer o ecossistema regional de inovação, gerando emprego qualificado, renda e impacto social.', 'publicado', now()),
  ('incubacao', 'Programa de Incubação', 'Trilha estruturada de pré-incubação, incubação e graduação para startups de base tecnológica.', 'O programa de incubação da ITNC é dividido em três etapas complementares.

Pré-incubação: validação da ideia, modelagem de negócio e construção do primeiro MVP com acompanhamento semanal.

Incubação: espaço físico, mentoria especializada, apoio jurídico e contábil, acesso a editais de fomento e conexão com clientes.

Graduação: preparação para o crescimento autônomo, captação de investimento e expansão comercial.', 'publicado', now()),
  ('hdi', 'HDI — Hub de Desenvolvimento e Inovação', 'Ambiente colaborativo para inovação aberta, pesquisa aplicada e projetos com empresas.', 'O HDI é o espaço de inovação aberta da ITNC, onde empresas, pesquisadores e startups desenvolvem soluções em conjunto.

Oferecemos laboratórios, salas de reunião, ambientes de coworking e programas de desafios de inovação conectando demandas reais do mercado a talentos técnicos.

Também apoiamos a estruturação de projetos de pesquisa, desenvolvimento e inovação (PD&I) com incentivos fiscais e editais de fomento.', 'publicado', now()),
  ('resultados', 'Resultados', 'Indicadores, impacto econômico e social gerado pelo ecossistema da ITNC.', 'Acompanhamos de perto o desempenho das empresas apoiadas e o impacto do ecossistema.

Os resultados são consolidados anualmente e incluem faturamento das incubadas, empregos gerados, investimentos captados e projetos de inovação aberta executados com parceiros.', 'publicado', now());

INSERT INTO public.empresas (slug, titulo, resumo, conteudo, setor, ano_ingresso, situacao, destaque, status, publicado_em) VALUES
  ('agrosense', 'AgroSense', 'Sensores e inteligência de dados para agricultura de precisão.', 'A AgroSense desenvolve sensores de baixo custo e uma plataforma de dados que ajuda produtores a reduzir desperdício de água e insumos.', 'Agtech', 2023, 'incubada', true, 'publicado', now()),
  ('medlog', 'MedLog', 'Logística inteligente para insumos hospitalares.', 'A MedLog otimiza a cadeia de suprimentos de hospitais e clínicas com previsão de demanda e rastreabilidade.', 'Healthtech', 2022, 'incubada', true, 'publicado', now()),
  ('edunext', 'EduNext', 'Plataforma de aprendizagem adaptativa para redes de ensino.', 'A EduNext personaliza trilhas de estudo com base no desempenho do estudante, apoiando professores com dados acionáveis.', 'Edtech', 2021, 'graduada', true, 'publicado', now()),
  ('cleanwatt', 'CleanWatt', 'Gestão de energia e eficiência energética para indústrias.', 'A CleanWatt monitora consumo em tempo real e identifica oportunidades de economia de energia em plantas industriais.', 'Energia', 2024, 'incubada', false, 'publicado', now());

INSERT INTO public.parceiros (slug, titulo, resumo, categoria, destaque, status, publicado_em) VALUES
  ('universidade-regional', 'Universidade Regional', 'Parceria em pesquisa aplicada, laboratórios e formação de talentos.', 'Academia', true, 'publicado', now()),
  ('sebrae', 'Sebrae', 'Capacitação empreendedora e apoio à gestão das incubadas.', 'Fomento', true, 'publicado', now()),
  ('prefeitura', 'Prefeitura Municipal', 'Apoio institucional e políticas públicas de inovação.', 'Poder público', true, 'publicado', now()),
  ('fundo-inovacao', 'Fundo Inovação', 'Investimento anjo e conexão com capital de risco.', 'Investimento', true, 'publicado', now());

INSERT INTO public.conquistas (slug, titulo, resumo, ano, categoria, destaque, status, publicado_em) VALUES
  ('premio-nacional-incubadoras', 'Prêmio Nacional de Incubadoras', 'Reconhecimento como uma das incubadoras mais bem avaliadas do país.', 2025, 'Premiação', true, 'publicado', now()),
  ('selo-cerne', 'Selo CERNE 2', 'Certificação de maturidade em processos de incubação.', 2024, 'Certificação', true, 'publicado', now()),
  ('destaque-inovacao-aberta', 'Destaque em Inovação Aberta', 'Programa de desafios com mais de 80 propostas recebidas.', 2024, 'Reconhecimento', true, 'publicado', now());