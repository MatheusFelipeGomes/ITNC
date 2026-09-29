import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/permissoes")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Permissões — Painel" },
      { name: "description", content: "Entenda o que cada perfil de acesso pode fazer no painel." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Permissões — Painel" },
      { property: "og:description", content: "Regras de acesso do painel do ITNC." },
    ],
  }),
  component: PermissoesPage,
});

const MATRIZ = [
  { acao: "Ver o painel e os conteúdos", leitura: true, editor: true, admin: true },
  { acao: "Criar, editar e excluir conteúdos", leitura: false, editor: true, admin: true },
  { acao: "Enviar e remover arquivos de mídia", leitura: false, editor: true, admin: true },
  { acao: "Alterar configurações do site", leitura: false, editor: true, admin: true },
  { acao: "Conceder ou remover permissões", leitura: false, editor: false, admin: true },
];

function Marca({ ativo }: { ativo: boolean }) {
  return (
    <span className={ativo ? "font-semibold text-primary" : "text-muted-foreground"}>
      {ativo ? "Sim" : "Não"}
    </span>
  );
}

function PermissoesPage() {
  return (
    <AdminShell
      title="Permissões"
      description="O que cada perfil pode fazer. As regras também são aplicadas no banco de dados."
      actions={
        <Button asChild size="sm" variant="outline">
          <Link to="/admin/usuarios">Gerenciar usuários</Link>
        </Button>
      }
    >
      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ação</TableHead>
              <TableHead>Somente leitura</TableHead>
              <TableHead>Editor</TableHead>
              <TableHead>Administrador</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MATRIZ.map((linha) => (
              <TableRow key={linha.acao}>
                <TableCell className="font-medium">{linha.acao}</TableCell>
                <TableCell>
                  <Marca ativo={linha.leitura} />
                </TableCell>
                <TableCell>
                  <Marca ativo={linha.editor} />
                </TableCell>
                <TableCell>
                  <Marca ativo={linha.admin} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-sm text-muted-foreground">
        Usuários sem perfil de gestor conseguem acessar o painel apenas em modo leitura: os botões de
        criar, editar e excluir ficam desativados e as operações também são bloqueadas no servidor.
      </p>
    </AdminShell>
  );
}
