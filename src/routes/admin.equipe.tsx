import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ContentManager } from "@/components/admin/ContentManager";

export const Route = createFileRoute("/admin/equipe")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Gerenciar Equipe — ITNC" },
      { name: "description", content: "Cadastre integrantes da equipe do ITNC com cargo e contato." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Gerenciar Equipe — ITNC" },
      { property: "og:description", content: "Gestão da equipe institucional do ITNC." },
    ],
  }),
  component: () => (
    <AdminShell title="Equipe" description="Cadastre os integrantes da equipe e suas funções.">
      <ContentManager
        table="equipe"
        singular="Integrante"
        plural="Equipe"
        extraColumns={[
          { key: "cargo", label: "Cargo", render: (row) => String(row['cargo'] ?? "—") },
        ]}
        fields={[
          { name: "titulo", label: "Nome", type: "text", required: true, full: true },
          { name: "slug", label: "Slug (URL)", type: "text", help: "Deixe vazio para gerar automaticamente" },
          { name: "cargo", label: "Cargo", type: "text" },
          { name: "area", label: "Área", type: "text" },
          { name: "email", label: "E-mail", type: "text" },
          { name: "linkedin_url", label: "LinkedIn", type: "text" },
          { name: "ordem", label: "Ordem de exibição", type: "number" },
          { name: "resumo", label: "Resumo", type: "textarea", full: true },
          { name: "conteudo", label: "Biografia", type: "longtext", full: true },
          { name: "imagem_url", label: "Foto", type: "media", full: true },
          { name: "destaque", label: "Destacar", type: "switch" },
        ]}
      />
    </AdminShell>
  ),
});
