import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { PaginaEditor } from "@/components/admin/PaginaEditor";

export const Route = createFileRoute("/admin/institucional/sobre")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Editar Sobre a ITNC — Painel" },
      { name: "description", content: "Edite o conteúdo da página institucional Sobre a ITNC." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Editar Sobre a ITNC — Painel" },
      { property: "og:description", content: "Gestão do conteúdo institucional do ITNC." },
    ],
  }),
  component: () => (
    <AdminShell title="Sobre a ITNC" description="Texto institucional exibido em /itnc/sobre.">
      <PaginaEditor slug="sobre" />
    </AdminShell>
  ),
});
