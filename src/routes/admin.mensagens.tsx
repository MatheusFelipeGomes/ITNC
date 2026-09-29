import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MailOpen } from "lucide-react";

import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/admin/mensagens")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Mensagens de Contato — ITNC" },
      { name: "description", content: "Mensagens enviadas pelo formulário de contato do site." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Mensagens de Contato — ITNC" },
      { property: "og:description", content: "Caixa de entrada do formulário de contato do ITNC." },
    ],
  }),
  component: MensagensPage,
});

function MensagensPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "contatos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contatos")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const marcarLida = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contatos").update({ lida: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "contatos"] }),
  });

  return (
    <AdminShell title="Mensagens" description="Contatos recebidos pelo formulário do site.">
      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (data ?? []).length === 0 ? (
        <p className="rounded-xl border border-border bg-background p-10 text-center text-sm text-muted-foreground">
          Nenhuma mensagem recebida.
        </p>
      ) : (
        <div className="space-y-4">
          {(data ?? []).map((mensagem) => (
            <article key={mensagem.id} className="card-elevated rounded-xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{mensagem.assunto || "Sem assunto"}</p>
                  <p className="text-xs text-muted-foreground">
                    {mensagem.nome} · {mensagem.email}
                    {mensagem.telefone ? ` · ${mensagem.telefone}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={mensagem.lida ? "secondary" : "default"}>
                    {mensagem.lida ? "Lida" : "Nova"}
                  </Badge>
                  {!mensagem.lida ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => marcarLida.mutate(mensagem.id)}
                    >
                      <MailOpen className="size-4" aria-hidden />
                      Marcar como lida
                    </Button>
                  ) : null}
                </div>
              </div>
              <p className="mt-4 whitespace-pre-line text-sm text-foreground/90">
                {mensagem.mensagem}
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                Recebida em {formatDateTime(mensagem.created_at)}
              </p>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
