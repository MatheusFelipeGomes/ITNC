import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export const Route = createFileRoute("/admin/midia/documentos")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Documentos — Painel" },
      { name: "description", content: "Envie e organize documentos institucionais do ITNC." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Documentos — Painel" },
      { property: "og:description", content: "Gestão de documentos do ITNC." },
    ],
  }),
  component: () => (
    <AdminShell title="Documentos" description="Planilhas, apresentações e arquivos de texto.">
      <MediaLibrary
        kind="documentos"
        accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.odt"
      />
    </AdminShell>
  ),
});
