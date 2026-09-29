import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { PaginaEditor } from "@/components/admin/PaginaEditor";

export const Route = createFileRoute("/admin/institucional/incubacao")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Editar Incubação — Painel" },
      { name: "description", content: "Edite o conteúdo da página do programa de incubação." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Editar Incubação — Painel" },
      { property: "og:description", content: "Gestão do programa de incubação do ITNC." },
    ],
  }),
  component: () => (
    <AdminShell title="Incubação" description="Conteúdo exibido na página /incubacao.">
      <PaginaEditor slug="incubacao" />
    </AdminShell>
  ),
});
