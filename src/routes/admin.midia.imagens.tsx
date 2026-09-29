import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export const Route = createFileRoute("/admin/midia/imagens")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Biblioteca de imagens — Painel" },
      { name: "description", content: "Envie e organize as imagens usadas no site do ITNC." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Biblioteca de imagens — Painel" },
      { property: "og:description", content: "Gestão de imagens do site do ITNC." },
    ],
  }),
  component: () => (
    <AdminShell
      title="Biblioteca de imagens"
      description="Envie imagens e copie o caminho para usar nos conteúdos."
    >
      <MediaLibrary kind="imagens" accept="image/*" />
    </AdminShell>
  ),
});
