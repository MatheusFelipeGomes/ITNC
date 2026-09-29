import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ContentManager } from "@/components/admin/ContentManager";

export const Route = createFileRoute("/admin/parceiros")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Gerenciar Parceiros — ITNC" },
      { name: "description", content: "Cadastre e publique parceiros institucionais do ITNC." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Gerenciar Parceiros — ITNC" },
      { property: "og:description", content: "Gestão da rede de parceiros do ITNC." },
    ],
  }),
  component: () => (
    <AdminShell title="Parceiros" description="Gerencie a rede de parceiros do ecossistema.">
      <ContentManager
        table="parceiros"
        singular="Parceiro"
        plural="Parceiros"
        extraColumns={[
          { key: "categoria", label: "Categoria", render: (row) => String(row['categoria'] ?? "—") },
        ]}
        fields={[
          { name: "titulo", label: "Nome", type: "text", required: true, full: true },
          { name: "slug", label: "Slug (URL)", type: "text", help: "Deixe vazio para gerar automaticamente" },
          { name: "categoria", label: "Categoria", type: "text" },
          { name: "site_url", label: "Site", type: "text", full: true },
          { name: "resumo", label: "Resumo", type: "textarea", full: true },
          { name: "imagem_url", label: "Logotipo", type: "media", full: true },
          { name: "destaque", label: "Destaque na home", type: "switch" },
        ]}
      />
    </AdminShell>
  ),
});
