import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ContentManager } from "@/components/admin/ContentManager";
import { SITUACAO_EMPRESA } from "@/lib/format";

export const Route = createFileRoute("/admin/empresas")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Gerenciar Empresas Incubadas — ITNC" },
      { name: "description", content: "Cadastre empresas incubadas, graduadas e associadas ao ITNC." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Gerenciar Empresas Incubadas — ITNC" },
      { property: "og:description", content: "Gestão do portfólio de empresas do ITNC." },
    ],
  }),
  component: () => (
    <AdminShell
      title="Empresas Incubadas"
      description="Gerencie o portfólio de startups incubadas, graduadas e associadas."
    >
      <ContentManager
        table="empresas"
        singular="Empresa"
        plural="Empresas"
        extraColumns={[
          {
            key: "situacao",
            label: "Situação",
            render: (row) => SITUACAO_EMPRESA[String(row['situacao'])] ?? String(row['situacao'] ?? "—"),
          },
        ]}
        fields={[
          { name: "titulo", label: "Nome da empresa", type: "text", required: true, full: true },
          { name: "slug", label: "Slug (URL)", type: "text", help: "Deixe vazio para gerar automaticamente" },
          { name: "setor", label: "Setor", type: "text" },
          { name: "ano_ingresso", label: "Ano de ingresso", type: "number" },
          {
            name: "situacao",
            label: "Situação",
            type: "select",
            options: [
              { value: "incubada", label: "Incubada" },
              { value: "graduada", label: "Graduada" },
              { value: "associada", label: "Associada" },
            ],
          },
          { name: "site_url", label: "Site", type: "text", full: true },
          { name: "resumo", label: "Resumo", type: "textarea", full: true },
          { name: "conteudo", label: "Conteúdo", type: "longtext", full: true },
          { name: "imagem_url", label: "Logotipo / imagem", type: "media", full: true },
          { name: "destaque", label: "Destaque na home", type: "switch" },
        ]}
      />
    </AdminShell>
  ),
});
