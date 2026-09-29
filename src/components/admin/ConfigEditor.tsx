import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAdminSession } from "@/hooks/useAdminSession";
import { supabase } from "@/integrations/supabase/client";

export interface ConfigField {
  name: string;
  label: string;
  type?: "text" | "textarea" | "switch";
  help?: string;
  maxLength?: number;
}

type Valores = Record<string, string | boolean>;

export function ConfigEditor({ chave, fields }: { chave: string; fields: ConfigField[] }) {
  const queryClient = useQueryClient();
  const { canManage } = useAdminSession();
  const [valores, setValores] = useState<Valores>({});

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "config", chave],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("configuracoes")
        .select("id,valor")
        .eq("chave", chave)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const valor = (data?.valor ?? {}) as Record<string, unknown>;
    const next: Valores = {};
    for (const field of fields) {
      const raw = valor[field.name];
      next[field.name] = field.type === "switch" ? Boolean(raw) : String(raw ?? "");
    }
    setValores(next);
  }, [data, fields]);

  const save = useMutation({
    mutationFn: async () => {
      if (!canManage) throw new Error("Você não tem permissão para esta operação.");
      for (const field of fields) {
        const value = valores[field.name];
        if (typeof value === "string" && value.length > (field.maxLength ?? 2000)) {
          throw new Error(`O campo "${field.label}" está muito longo`);
        }
      }
      const payload = { chave, valor: valores as never };
      if (data?.id) {
        const { error } = await supabase.from("configuracoes").update(payload).eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("configuracoes").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "config", chave] });
      toast.success("Configurações salvas.");
    },
    onError: (error: Error) => toast.error(error.message || "Não foi possível salvar."),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-5 rounded-xl border border-border bg-background p-6">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          {field.type === "textarea" ? (
            <Textarea
              id={field.name}
              rows={4}
              value={String(valores[field.name] ?? "")}
              onChange={(e) => setValores((p) => ({ ...p, [field.name]: e.target.value }))}
            />
          ) : field.type === "switch" ? (
            <div className="flex h-9 items-center">
              <Switch
                id={field.name}
                checked={Boolean(valores[field.name])}
                onCheckedChange={(checked) =>
                  setValores((p) => ({ ...p, [field.name]: checked }))
                }
              />
            </div>
          ) : (
            <Input
              id={field.name}
              maxLength={field.maxLength ?? 255}
              value={String(valores[field.name] ?? "")}
              onChange={(e) => setValores((p) => ({ ...p, [field.name]: e.target.value }))}
            />
          )}
          {field.help ? <p className="text-xs text-muted-foreground">{field.help}</p> : null}
        </div>
      ))}
      <Button onClick={() => save.mutate()} disabled={save.isPending || !canManage}>
        {save.isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        Salvar configurações
      </Button>
    </div>
  );
}
