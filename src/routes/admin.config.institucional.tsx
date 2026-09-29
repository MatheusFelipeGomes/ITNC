import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ConfigEditor } from "@/components/admin/ConfigEditor";

export const Route = createFileRoute("/admin/config/institucional")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Informações institucionais — Painel" },
      { name: "description", content: "Atualize endereço, telefone e e-mail institucional do ITNC." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Informações institucionais — Painel" },
      { property: "og:description", content: "Dados de contato institucional do ITNC." },
    ],
  }),
  component: () => (
    <AdminShell
      title="Informações institucionais"
      description="Dados usados no rodapé e na página de contato."
    >
      <ConfigEditor
        chave="institucional"
        fields={[
          { name: "nome", label: "Nome da instituição" },
          { name: "descricao", label: "Descrição curta", type: "textarea" },
          { name: "endereco", label: "Endereço", type: "textarea" },
          { name: "telefone", label: "Telefone" },
          { name: "email", label: "E-mail de contato" },
          { name: "horario", label: "Horário de atendimento" },
        ]}
      />
    </AdminShell>
  ),
});
