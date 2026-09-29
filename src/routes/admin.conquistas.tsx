import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ContentManager } from "@/components/admin/ContentManager";

export const Route = createFileRoute("/admin/conquistas")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Gerenciar Conquistas — ITNC" },
      { name: "description", content: "Registre conquistas e marcos históricos do ITNC." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Gerenciar Conquistas — ITNC" },
      { property: "og:description", content: "Gestão das conquistas do ecossistema ITNC." },
    ],
  }),
  component: () => (
    <AdminShell title="Conquistas" description="Marcos e reconhecimentos do ecossistema.">
      <ContentManager
        table="conquistas"
        singular="Conquista"
        plural="Conquistas"
        extraColumns={[
          { key: "ano", label: "Ano", render: (row) => String(row['ano'] ?? "—") },
          { key: "categoria", label: "Categoria", render: (row) => String(row['categoria'] ?? "—") },
        ]}
        fields={[
          { name: "titulo", label: "Título", type: "text", required: true, full: true },
          { name: "slug", label: "Slug (URL)", type: "text", help: "Deixe vazio para gerar automaticamente" },
          { name: "ano", label: "Ano", type: "number" },
          { name: "categoria", label: "Categoria", type: "text" },
          { name: "resumo", label: "Resumo", type: "textarea", full: true },
          { name: "conteudo", label: "Conteúdo", type: "longtext", full: true },
          { name: "imagem_url", label: "Imagem", type: "media", full: true },
          { name: "destaque", label: "Destaque na home", type: "switch" },
        ]}
      />
    </AdminShell>
  ),
});
