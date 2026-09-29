import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ContentManager } from "@/components/admin/ContentManager";

export const Route = createFileRoute("/admin/noticias")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Gerenciar Notícias — ITNC" },
      { name: "description", content: "Crie, edite e publique notícias do site do ITNC." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Gerenciar Notícias — ITNC" },
      { property: "og:description", content: "CMS de notícias da incubadora do ITNC." },
    ],
  }),
  component: () => (
    <AdminShell title="Notícias" description="Crie, edite e publique notícias do site.">
      <ContentManager
        table="noticias"
        singular="Notícia"
        plural="Notícias"
        fields={[
          { name: "titulo", label: "Título", type: "text", required: true, full: true },
          { name: "slug", label: "Slug (URL)", type: "text", help: "Deixe vazio para gerar automaticamente" },
          { name: "categoria", label: "Categoria", type: "text" },
          { name: "resumo", label: "Resumo", type: "textarea", full: true },
          { name: "conteudo", label: "Conteúdo", type: "longtext", full: true },
          { name: "imagem_url", label: "Imagem de capa", type: "media", full: true },
          { name: "destaque", label: "Destaque na home", type: "switch" },
        ]}
      />
    </AdminShell>
  ),
});
