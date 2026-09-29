import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ContentManager } from "@/components/admin/ContentManager";

export const Route = createFileRoute("/admin/hero")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Gerenciar Hero — ITNC" },
      {
        name: "description",
        content: "Edite título, subtítulo, imagem, botões e ordem do hero da página inicial.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Gerenciar Hero — ITNC" },
      { property: "og:description", content: "CMS do hero da home do ITNC." },
    ],
  }),
  component: () => (
    <AdminShell
      title="Hero da home"
      description="O hero exibido é o publicado e ativo com destaque e menor ordem."
    >
      <ContentManager
        table="heroes"
        singular="Hero"
        plural="Heros"
        extraColumns={[
          { key: "ordem", label: "Ordem", render: (row) => String(row["ordem"] ?? 0) },
          { key: "ativo", label: "Ativo", render: (row) => (row["ativo"] ? "Sim" : "Não") },
          { key: "destaque", label: "Destaque", render: (row) => (row["destaque"] ? "Sim" : "Não") },
        ]}
        fields={[
          { name: "titulo", label: "Título principal", type: "text", required: true, full: true },
          {
            name: "subtitulo",
            label: "Subtítulo",
            type: "textarea",
            full: true,
            maxLength: 500,
          },
          { name: "eyebrow", label: "Chamada superior", type: "text", full: true },
          {
            name: "slug",
            label: "Identificador (slug)",
            type: "text",
            help: "Deixe vazio para gerar automaticamente",
          },
          {
            name: "ordem",
            label: "Ordem de exibição",
            type: "text",
            help: "Menor número aparece primeiro",
          },
          { name: "cta_primario_label", label: "Botão 1 — texto", type: "text" },
          { name: "cta_primario_url", label: "Botão 1 — link", type: "text" },
          { name: "cta_secundario_label", label: "Botão 2 — texto", type: "text" },
          { name: "cta_secundario_url", label: "Botão 2 — link", type: "text" },
          {
            name: "imagem_url",
            label: "Imagem do hero",
            type: "media",
            full: true,
            help: "Envie uma imagem ou informe uma URL. Sem imagem, usamos a padrão do site.",
          },
          { name: "ativo", label: "Hero ativo", type: "switch" },
          { name: "destaque", label: "Definir como destaque", type: "switch" },
        ]}
      />
    </AdminShell>
  ),
});
