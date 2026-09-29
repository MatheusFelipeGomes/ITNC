import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, FolderOpen, Loader2, Search, Trash2, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminSession } from "@/hooks/useAdminSession";
import { supabase } from "@/integrations/supabase/client";
import { formatShortDate } from "@/lib/format";

export type MediaKind = "imagens" | "documentos" | "pdfs";

const EXTENSOES: Record<MediaKind, string[]> = {
  imagens: ["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"],
  documentos: ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "csv", "txt", "odt"],
  pdfs: ["pdf"],
};

const PASTAS = ["biblioteca", "noticias", "editais", "eventos", "heroes", "empresas", "parceiros", "conquistas", "equipe"];

interface Arquivo {
  path: string;
  nome: string;
  criadoEm: string | null;
  tamanho: number | null;
}

export function MediaLibrary({ kind, accept }: { kind: MediaKind; accept: string }) {
  const queryClient = useQueryClient();
  const { canManage } = useAdminSession();
  const [busca, setBusca] = useState("");
  const [uploading, setUploading] = useState(false);
  const [removendo, setRemovendo] = useState<Arquivo | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "midia", kind],
    queryFn: async (): Promise<Arquivo[]> => {
      const listas = await Promise.all(
        PASTAS.map(async (pasta) => {
          const { data, error } = await supabase.storage
            .from("midias")
            .list(pasta, { limit: 200, sortBy: { column: "created_at", order: "desc" } });
          if (error) return [];
          return (data ?? []).map((item) => ({
            path: `${pasta}/${item.name}`,
            nome: item.name,
            criadoEm: item.created_at ?? null,
            tamanho: (item.metadata as { size?: number } | null)?.size ?? null,
          }));
        }),
      );
      return listas.flat().filter((arquivo) => {
        const ext = arquivo.nome.split(".").pop()?.toLowerCase() ?? "";
        return EXTENSOES[kind].includes(ext);
      });
    },
  });

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return (data ?? []).filter((a) => a.path.toLowerCase().includes(termo));
  }, [data, busca]);

  async function handleUpload(file: File) {
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Arquivo maior que 20 MB.");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "bin";
    const { error } = await supabase.storage
      .from("midias")
      .upload(`biblioteca/${crypto.randomUUID()}.${ext}`, file, { upsert: false });
    setUploading(false);
    if (error) {
      toast.error("Falha ao enviar o arquivo.");
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["admin", "midia"] });
    toast.success("Arquivo enviado.");
  }

  const remover = useMutation({
    mutationFn: async (arquivo: Arquivo) => {
      if (!canManage) throw new Error("Você não tem permissão para esta operação.");
      const { error } = await supabase.storage.from("midias").remove([arquivo.path]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "midia"] });
      setRemovendo(null);
      toast.success("Arquivo removido.");
    },
    onError: (error: Error) => toast.error(error.message || "Não foi possível remover."),
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar arquivo..."
            aria-label="Buscar arquivo"
            className="pl-9"
          />
        </div>
        <Button asChild disabled={!canManage}>
          <label className="cursor-pointer">
            {uploading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Upload className="size-4" aria-hidden />
            )}
            Enviar arquivo
            <input
              type="file"
              accept={accept}
              className="sr-only"
              disabled={!canManage}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(file);
                e.target.value = "";
              }}
            />
          </label>
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-background">
        {isLoading ? (
          <div className="space-y-3 p-6">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-2/3" />
          </div>
        ) : isError ? (
          <div className="p-10 text-center">
            <p className="text-sm text-muted-foreground">Não foi possível listar os arquivos.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => void refetch()}>
              Tentar novamente
            </Button>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="p-12 text-center">
            <FolderOpen className="mx-auto size-8 text-muted-foreground" aria-hidden />
            <p className="mt-3 text-sm font-medium">Nenhum arquivo encontrado</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Envie um arquivo para começar sua biblioteca.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Arquivo</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Enviado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.map((arquivo) => (
                  <TableRow key={arquivo.path}>
                    <TableCell className="max-w-md truncate font-medium">{arquivo.path}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {arquivo.tamanho ? `${Math.round(arquivo.tamanho / 1024)} KB` : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatShortDate(arquivo.criadoEm) || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Copiar caminho"
                          onClick={() => {
                            void navigator.clipboard.writeText(arquivo.path);
                            toast.success("Caminho copiado.");
                          }}
                        >
                          <Copy className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Excluir arquivo"
                          disabled={!canManage}
                          onClick={() => setRemovendo(arquivo)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <AlertDialog open={Boolean(removendo)} onOpenChange={(o) => !o && setRemovendo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir arquivo?</AlertDialogTitle>
            <AlertDialogDescription>
              O arquivo “{removendo?.nome}” será removido permanentemente e deixará de aparecer nos
              conteúdos que o utilizam.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => removendo && remover.mutate(removendo)}
              disabled={remover.isPending}
            >
              {remover.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
