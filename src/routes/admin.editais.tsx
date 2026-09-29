import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ContentManager } from "@/components/admin/ContentManager";

export const Route = createFileRoute("/admin/editais")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Gerenciar Editais — ITNC" },
      { name: "description", content: "Crie, edite e publique editais da incubadora do ITNC." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Gerenciar Editais — ITNC" },
      { property: "og:description", content: "CMS de editais da incubadora do ITNC." },
    ],
  }),
  component: () => (
    <AdminShell title="Editais" description="Publique chamadas públicas e documentos oficiais.">
      <ContentManager
        table="editais"
        singular="Edital"
        plural="Editais"
        fields={[
          { name: "titulo", label: "Título", type: "text", required: true, full: true },
          { name: "slug", label: "Slug (URL)", type: "text", help: "Deixe vazio para gerar automaticamente" },
          {
            name: "situacao",
            label: "Situação",
            type: "select",
            options: [
              { value: "aberto", label: "Inscrições abertas" },
              { value: "em_breve", label: "Em breve" },
              { value: "encerrado", label: "Encerrado" },
            ],
          },
          { name: "inscricoes_inicio", label: "Início das inscrições", type: "date" },
          { name: "inscricoes_fim", label: "Fim das inscrições", type: "date" },
          { name: "resumo", label: "Resumo", type: "textarea", full: true },
          { name: "conteudo", label: "Conteúdo", type: "longtext", full: true },
          { name: "arquivo_url", label: "Documento (PDF)", type: "media", full: true },
        ]}
      />
    </AdminShell>
  ),
});
