import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export const Route = createFileRoute("/admin/midia/pdfs")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "PDFs — Painel" },
      { name: "description", content: "Envie editais e materiais em PDF do ITNC." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "PDFs — Painel" },
      { property: "og:description", content: "Gestão de arquivos PDF do ITNC." },
    ],
  }),
  component: () => (
    <AdminShell title="PDFs" description="Editais, regulamentos e materiais para download.">
      <MediaLibrary kind="pdfs" accept="application/pdf" />
    </AdminShell>
  ),
});
