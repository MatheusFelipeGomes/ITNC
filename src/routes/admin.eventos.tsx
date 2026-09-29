import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ContentManager } from "@/components/admin/ContentManager";

export const Route = createFileRoute("/admin/eventos")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Gerenciar Eventos — ITNC" },
      { name: "description", content: "Crie, edite e publique eventos da agenda do ITNC." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Gerenciar Eventos — ITNC" },
      { property: "og:description", content: "CMS da agenda de eventos do ITNC." },
    ],
  }),
  component: () => (
    <AdminShell title="Eventos" description="Gerencie a agenda de eventos do ecossistema.">
      <ContentManager
        table="eventos"
        singular="Evento"
        plural="Eventos"
        fields={[
          { name: "titulo", label: "Título", type: "text", required: true, full: true },
          { name: "slug", label: "Slug (URL)", type: "text", help: "Deixe vazio para gerar automaticamente" },
          { name: "local", label: "Local", type: "text" },
          { name: "inicio", label: "Início", type: "datetime" },
          { name: "fim", label: "Término", type: "datetime" },
          { name: "inscricao_url", label: "Link de inscrição", type: "text", full: true },
          { name: "resumo", label: "Resumo", type: "textarea", full: true },
          { name: "conteudo", label: "Conteúdo", type: "longtext", full: true },
          { name: "imagem_url", label: "Imagem de capa", type: "media", full: true },
        ]}
      />
    </AdminShell>
  ),
});
