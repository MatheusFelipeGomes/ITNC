import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ContentManager } from "@/components/admin/ContentManager";

export const Route = createFileRoute("/admin/premiacoes")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Gerenciar Premiações — ITNC" },
      { name: "description", content: "Cadastre prêmios recebidos pelo ITNC e pelas empresas incubadas." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Gerenciar Premiações — ITNC" },
      { property: "og:description", content: "Gestão das premiações do ecossistema ITNC." },
    ],
  }),
  component: () => (
    <AdminShell
      title="Premiações"
      description="Prêmios recebidos pelo ITNC e pelas empresas do portfólio."
    >
      <ContentManager
        table="conquistas"
        singular="Premiação"
        plural="Premiações"
        fixedValues={{ categoria: "Premiação" }}
        filterEq={{ column: "categoria", value: "Premiação" }}
        extraColumns={[{ key: "ano", label: "Ano", render: (row) => String(row['ano'] ?? "—") }]}
        fields={[
          { name: "titulo", label: "Título do prêmio", type: "text", required: true, full: true },
          { name: "slug", label: "Slug (URL)", type: "text", help: "Deixe vazio para gerar automaticamente" },
          { name: "ano", label: "Ano", type: "number" },
          { name: "resumo", label: "Resumo", type: "textarea", full: true },
          { name: "conteudo", label: "Conteúdo", type: "longtext", full: true },
          { name: "imagem_url", label: "Imagem", type: "media", full: true },
          { name: "destaque", label: "Destaque na home", type: "switch" },
        ]}
      />
    </AdminShell>
  ),
});
