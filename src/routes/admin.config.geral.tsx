import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ConfigEditor } from "@/components/admin/ConfigEditor";

export const Route = createFileRoute("/admin/config/geral")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Configurações gerais — Painel" },
      { name: "description", content: "Ajustes gerais de exibição do site do ITNC." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Configurações gerais — Painel" },
      { property: "og:description", content: "Preferências gerais do site do ITNC." },
    ],
  }),
  component: () => (
    <AdminShell title="Configurações gerais" description="Preferências de exibição do site.">
      <ConfigEditor
        chave="geral"
        fields={[
          { name: "mostrar_eventos", label: "Exibir agenda de eventos na home", type: "switch" },
          { name: "mostrar_editais", label: "Exibir editais na home", type: "switch" },
          { name: "mostrar_parceiros", label: "Exibir parceiros na home", type: "switch" },
          { name: "aviso_topo", label: "Aviso no topo do site", type: "textarea" },
          { name: "email_notificacoes", label: "E-mail para notificações de contato" },
        ]}
      />
    </AdminShell>
  ),
});
