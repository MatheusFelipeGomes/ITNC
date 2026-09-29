import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { UsuariosManager } from "@/components/admin/UsuariosManager";

export const Route = createFileRoute("/admin/usuarios")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Usuários — Painel" },
      { name: "description", content: "Gerencie os usuários e as permissões do painel do ITNC." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Usuários — Painel" },
      { property: "og:description", content: "Gestão de acessos ao painel do ITNC." },
    ],
  }),
  component: () => (
    <AdminShell title="Usuários" description="Conceda ou remova permissões administrativas.">
      <UsuariosManager />
    </AdminShell>
  ),
});
