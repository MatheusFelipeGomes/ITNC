import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ContentManager } from "@/components/admin/ContentManager";

export const Route = createFileRoute("/admin/resultados")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Gerenciar Resultados — ITNC" },
      { name: "description", content: "Atualize os indicadores de resultados do ITNC." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Gerenciar Resultados — ITNC" },
      { property: "og:description", content: "Gestão dos indicadores de impacto do ITNC." },
    ],
  }),
  component: () => (
    <AdminShell
      title="Resultados"
      description="Indicadores exibidos na home e na página de resultados."
    >
      <ContentManager
        table="indicadores"
        singular="Indicador"
        plural="Indicadores"
        extraColumns={[
          { key: "valor", label: "Valor", render: (row) => String(row['valor'] ?? "—") },
        ]}
        fields={[
          { name: "titulo", label: "Título", type: "text", required: true, full: true },
          { name: "slug", label: "Slug (URL)", type: "text", help: "Deixe vazio para gerar automaticamente" },
          { name: "valor", label: "Valor exibido", type: "text", required: true, help: "Ex.: 120, 85%, R$ 4,2 mi" },
          { name: "ordem", label: "Ordem de exibição", type: "number" },
          { name: "resumo", label: "Descrição", type: "textarea", full: true },
          { name: "destaque", label: "Exibir na home", type: "switch" },
        ]}
      />
    </AdminShell>
  ),
});
