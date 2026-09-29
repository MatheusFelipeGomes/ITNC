import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ConfigEditor } from "@/components/admin/ConfigEditor";

export const Route = createFileRoute("/admin/config/redes-sociais")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Redes sociais — Painel" },
      { name: "description", content: "Cadastre os links das redes sociais do ITNC." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Redes sociais — Painel" },
      { property: "og:description", content: "Links sociais exibidos no site do ITNC." },
    ],
  }),
  component: () => (
    <AdminShell title="Redes sociais" description="Links exibidos no rodapé e nas páginas de contato.">
      <ConfigEditor
        chave="redes_sociais"
        fields={[
          { name: "instagram", label: "Instagram" },
          { name: "linkedin", label: "LinkedIn" },
          { name: "facebook", label: "Facebook" },
          { name: "youtube", label: "YouTube" },
          { name: "whatsapp", label: "WhatsApp" },
        ]}
      />
    </AdminShell>
  ),
});
