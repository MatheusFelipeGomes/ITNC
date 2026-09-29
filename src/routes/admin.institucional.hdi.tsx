import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { PaginaEditor } from "@/components/admin/PaginaEditor";

export const Route = createFileRoute("/admin/institucional/hdi")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Editar HDI — Painel" },
      { name: "description", content: "Edite o conteúdo da página do programa HDI." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Editar HDI — Painel" },
      { property: "og:description", content: "Gestão do programa HDI do ITNC." },
    ],
  }),
  component: () => (
    <AdminShell title="HDI" description="Conteúdo exibido na página /hdi.">
      <PaginaEditor slug="hdi" />
    </AdminShell>
  ),
});
