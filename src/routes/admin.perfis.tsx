import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminSession } from "@/hooks/useAdminSession";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/perfis")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Meu perfil — Painel" },
      { name: "description", content: "Atualize seus dados de gestor no painel do ITNC." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Meu perfil — Painel" },
      { property: "og:description", content: "Dados do gestor no painel do ITNC." },
    ],
  }),
  component: PerfilPage,
});

function PerfilPage() {
  const { session, userId } = useAdminSession();
  const queryClient = useQueryClient();
  const [nome, setNome] = useState("");

  useEffect(() => {
    if (session?.nome) setNome(session.nome);
  }, [session?.nome]);

  const save = useMutation({
    mutationFn: async () => {
      const valor = nome.trim();
      if (!valor) throw new Error("Informe seu nome");
      if (valor.length > 120) throw new Error("O nome deve ter no máximo 120 caracteres");
      const { error } = await supabase.from("profiles").update({ nome: valor }).eq("id", userId!);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
      toast.success("Perfil atualizado.");
    },
    onError: (error: Error) => toast.error(error.message || "Não foi possível salvar."),
  });

  return (
    <AdminShell title="Meu perfil" description="Seus dados de identificação no painel.">
      <div className="max-w-xl space-y-5 rounded-xl border border-border bg-background p-6">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome</Label>
          <Input
            id="nome"
            value={nome}
            maxLength={120}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" value={session?.email ?? ""} disabled />
        </div>
        <div className="space-y-2">
          <Label>Permissões</Label>
          <div className="flex flex-wrap gap-1">
            {(session?.roles ?? []).length === 0 ? (
              <Badge variant="secondary">Somente leitura</Badge>
            ) : (
              session!.roles.map((role) => (
                <Badge key={role} className="capitalize">
                  {role}
                </Badge>
              ))
            )}
          </div>
        </div>
        <Button onClick={() => save.mutate()} disabled={save.isPending || !userId}>
          {save.isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          Salvar perfil
        </Button>
      </div>
    </AdminShell>
  );
}
