import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAdminSession } from "@/hooks/useAdminSession";
import { supabase } from "@/integrations/supabase/client";

interface PaginaForm {
  titulo: string;
  resumo: string;
  conteudo: string;
  imagem_url: string;
  status: string;
}

const EMPTY: PaginaForm = {
  titulo: "",
  resumo: "",
  conteudo: "",
  imagem_url: "",
  status: "rascunho",
};

export function PaginaEditor({ slug }: { slug: string }) {
  const queryClient = useQueryClient();
  const { canManage } = useAdminSession();
  const [form, setForm] = useState<PaginaForm>(EMPTY);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "pagina", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("paginas")
        .select("id,titulo,resumo,conteudo,imagem_url,status")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!data) return;
    setForm({
      titulo: data.titulo ?? "",
      resumo: data.resumo ?? "",
      conteudo: data.conteudo ?? "",
      imagem_url: data.imagem_url ?? "",
      status: data.status ?? "rascunho",
    });
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      if (!canManage) throw new Error("Você não tem permissão para esta operação.");
      const titulo = form.titulo.trim();
      if (!titulo) throw new Error("Informe o título da página");
      if (titulo.length > 200) throw new Error("O título deve ter no máximo 200 caracteres");

      const payload = {
        slug,
        titulo,
        resumo: form.resumo.trim(),
        conteudo: form.conteudo,
        imagem_url: form.imagem_url.trim() || null,
        status: form.status,
        publicado_em: form.status === "publicado" ? new Date().toISOString() : null,
      };

      if (data?.id) {
        const { error } = await supabase.from("paginas").update(payload).eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("paginas").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pagina", slug] });
      toast.success("Página salva.");
    },
    onError: (error: Error) => toast.error(error.message || "Não foi possível salvar."),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-5 rounded-xl border border-border bg-background p-6">
      <div className="space-y-2">
        <Label htmlFor="titulo">Título *</Label>
        <Input
          id="titulo"
          value={form.titulo}
          maxLength={200}
          onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="resumo">Resumo</Label>
        <Textarea
          id="resumo"
          rows={3}
          value={form.resumo}
          onChange={(e) => setForm((p) => ({ ...p, resumo: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="conteudo">Conteúdo</Label>
        <Textarea
          id="conteudo"
          rows={14}
          value={form.conteudo}
          onChange={(e) => setForm((p) => ({ ...p, conteudo: e.target.value }))}
        />
        <p className="text-xs text-muted-foreground">
          Separe os parágrafos com uma linha em branco.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="imagem">Imagem (caminho no storage ou URL)</Label>
          <Input
            id="imagem"
            value={form.imagem_url}
            onChange={(e) => setForm((p) => ({ ...p, imagem_url: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rascunho">Rascunho</SelectItem>
              <SelectItem value="publicado">Publicado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={() => save.mutate()} disabled={save.isPending || !canManage}>
        {save.isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        Salvar página
      </Button>
    </div>
  );
}
