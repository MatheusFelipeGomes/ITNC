import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ConfigEditor } from "@/components/admin/ConfigEditor";

export const Route = createFileRoute("/admin/config/seo")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "SEO — Painel" },
      { name: "description", content: "Configure título, descrição e imagem de compartilhamento." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "SEO — Painel" },
      { property: "og:description", content: "Configurações de busca e compartilhamento do site." },
    ],
  }),
  component: () => (
    <AdminShell title="SEO" description="Textos usados por buscadores e redes sociais.">
      <ConfigEditor
        chave="seo"
        fields={[
          { name: "titulo", label: "Título padrão", help: "Ideal até 60 caracteres", maxLength: 80 },
          {
            name: "descricao",
            label: "Descrição padrão",
            type: "textarea",
            help: "Ideal até 160 caracteres",
            maxLength: 200,
          },
          { name: "palavras_chave", label: "Palavras-chave" },
          { name: "imagem_compartilhamento", label: "Imagem de compartilhamento (URL)" },
        ]}
      />
    </AdminShell>
  ),
});
