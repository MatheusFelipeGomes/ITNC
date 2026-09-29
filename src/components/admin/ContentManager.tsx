import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Inbox, Loader2, Pencil, Plus, Search, Trash2, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAdminSession } from "@/hooks/useAdminSession";
import { supabase } from "@/integrations/supabase/client";
import { formatShortDate, slugify } from "@/lib/format";

export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "longtext"
  | "date"
  | "datetime"
  | "select"
  | "switch"
  | "media";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
  maxLength?: number;
  full?: boolean;
}

export type ContentTable =
  | "noticias"
  | "editais"
  | "eventos"
  | "heroes"
  | "parceiros"
  | "empresas"
  | "conquistas"
  | "indicadores"
  | "equipe";

type Row = Record<string, unknown>;

const STATUS_OPTIONS = [
  { value: "rascunho", label: "Rascunho" },
  { value: "publicado", label: "Publicado" },
];

const PAGE_SIZE = 10;

export function ContentManager({
  table,
  singular,
  plural,
  fields,
  extraColumns,
  fixedValues,
  filterEq,
}: {
  table: ContentTable;
  singular: string;
  plural: string;
  fields: FieldConfig[];
  extraColumns?: { key: string; label: string; render: (row: Row) => React.ReactNode }[];
  /** Valores aplicados automaticamente ao salvar (ex.: categoria fixa). */
  fixedValues?: Record<string, string>;
  /** Filtro fixo de listagem (ex.: apenas registros de uma categoria). */
  filterEq?: { column: string; value: string };
}) {
  const queryClient = useQueryClient();
  const { canManage } = useAdminSession();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Row>({});
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [pagina, setPagina] = useState(1);

  const queryKey = useMemo(
    () => ["admin", table, filterEq?.value ?? null] as const,
    [table, filterEq?.value],
  );

  const { data: rows, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      let query = supabase.from(table).select("*").order("created_at", { ascending: false });
      if (filterEq) query = query.eq(filterEq.column, filterEq.value);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const filtered = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return (rows ?? []).filter((row) => {
      if (statusFiltro !== "todos" && row['status'] !== statusFiltro) return false;
      if (!termo) return true;
      return ["titulo", "resumo", "slug", "categoria", "setor", "cargo"].some((key) =>
        String(row[key] ?? "").toLowerCase().includes(termo),
      );
    });
  }, [rows, busca, statusFiltro]);

  const totalPaginas = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = filtered.slice((paginaAtual - 1) * PAGE_SIZE, paginaAtual * PAGE_SIZE);

  useEffect(() => {
    setPagina(1);
  }, [busca, statusFiltro]);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setForm({ ...editing });
    } else {
      const blank: Row = { status: "rascunho" };
      for (const field of fields) {
        blank[field.name] = field.type === "switch" ? false : "";
      }
      setForm(blank);
    }
  }, [open, editing, fields]);

  const save = useMutation({
    mutationFn: async (values: Row) => {
      if (!canManage) throw new Error("Você não tem permissão para esta operação.");

      const titulo = String(values['titulo'] ?? "").trim();
      if (!titulo) throw new Error("Informe o título");
      if (titulo.length > 200) throw new Error("O título deve ter no máximo 200 caracteres");

      const payload: Row = { ...values, ...(fixedValues ?? {}) };
      payload['slug'] = slugify(String(values['slug'] ?? "").trim() || titulo);

      for (const field of fields) {
        const raw = payload[field.name];
        if (field.required && (raw === "" || raw === null || raw === undefined)) {
          throw new Error(`Preencha o campo "${field.label}"`);
        }
        if (field.type === "number") {
          payload[field.name] = raw === "" || raw === null ? null : Number(raw);
          if (payload[field.name] !== null && Number.isNaN(payload[field.name] as number)) {
            throw new Error(`O campo "${field.label}" deve ser numérico`);
          }
          continue;
        }
        if (raw === "") payload[field.name] = null;
      }

      if (payload['status'] === "publicado" && !payload['publicado_em']) {
        payload['publicado_em'] = new Date().toISOString();
      }
      if (payload['status'] !== "publicado") payload['publicado_em'] = null;

      delete payload['created_at'];
      delete payload['updated_at'];

      if (editing) {
        const { error } = await supabase
          .from(table)
          .update(payload as never)
          .eq("id", String(editing['id']));
        if (error) throw error;
      } else {
        delete payload['id'];
        const { error } = await supabase.from(table).insert(payload as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      setOpen(false);
      setEditing(null);
      toast.success(editing ? `${singular} atualizado(a).` : `${singular} criado(a).`);
    },
    onError: (error: Error) => toast.error(error.message || "Não foi possível salvar."),
  });

  const remove = useMutation({
    mutationFn: async (row: Row) => {
      if (!canManage) throw new Error("Você não tem permissão para esta operação.");
      const { error } = await supabase.from(table).delete().eq("id", String(row['id']));
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      setDeleting(null);
      toast.success(`${singular} removido(a).`);
    },
    onError: (error: Error) => toast.error(error.message || "Não foi possível remover."),
  });

  async function handleUpload(field: FieldConfig, file: File) {
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Arquivo maior que 20 MB.");
      return;
    }
    setUploading(field.name);
    const ext = file.name.split(".").pop() ?? "bin";
    const path = `${table}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("midias").upload(path, file, { upsert: false });
    setUploading(null);
    if (error) {
      toast.error("Falha ao enviar o arquivo.");
      return;
    }
    setForm((prev) => ({ ...prev, [field.name]: path }));
    toast.success("Arquivo enviado.");
  }

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
            placeholder={`Buscar em ${plural.toLowerCase()}...`}
            aria-label="Buscar"
            className="pl-9"
          />
        </div>
        <Select value={statusFiltro} onValueChange={setStatusFiltro}>
          <SelectTrigger className="w-44" aria-label="Filtrar por status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          disabled={!canManage}
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="size-4" aria-hidden />
          Novo(a) {singular.toLowerCase()}
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-background">
        {isLoading ? (
          <div className="space-y-3 p-6">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-2/3" />
          </div>
        ) : isError ? (
          <div className="p-10 text-center">
            <p className="text-sm text-muted-foreground">Não foi possível carregar os registros.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => void refetch()}>
              Tentar novamente
            </Button>
          </div>
        ) : visiveis.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox className="mx-auto size-8 text-muted-foreground" aria-hidden />
            <p className="mt-3 text-sm font-medium">Nenhum registro encontrado</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {busca || statusFiltro !== "todos"
                ? "Ajuste a busca ou os filtros."
                : `Cadastre o primeiro item em ${plural.toLowerCase()}.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Status</TableHead>
                  {extraColumns?.map((col) => <TableHead key={col.key}>{col.label}</TableHead>)}
                  <TableHead>Publicado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visiveis.map((row) => (
                  <TableRow key={String(row['id'])}>
                    <TableCell className="max-w-sm font-medium">{String(row['titulo'])}</TableCell>
                    <TableCell>
                      <Badge variant={row['status'] === "publicado" ? "default" : "secondary"}>
                        {row['status'] === "publicado" ? "Publicado" : "Rascunho"}
                      </Badge>
                    </TableCell>
                    {extraColumns?.map((col) => (
                      <TableCell key={col.key} className="text-sm text-muted-foreground">
                        {col.render(row)}
                      </TableCell>
                    ))}
                    <TableCell className="text-sm text-muted-foreground">
                      {formatShortDate(row['publicado_em'] as string | null) || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Editar"
                          disabled={!canManage}
                          onClick={() => {
                            setEditing(row);
                            setOpen(true);
                          }}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Excluir"
                          disabled={!canManage}
                          onClick={() => setDeleting(row)}
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

      {filtered.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {filtered.length} registro(s) · página {paginaAtual} de {totalPaginas}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={paginaAtual <= 1}
              onClick={() => setPagina(paginaAtual - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={paginaAtual >= totalPaginas}
              onClick={() => setPagina(paginaAtual + 1)}
            >
              Próxima
            </Button>
          </div>
        </div>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Editar ${singular.toLowerCase()}` : `Novo(a) ${singular.toLowerCase()}`}
            </DialogTitle>
            <DialogDescription>
              Os campos marcados com * são obrigatórios. O conteúdo só aparece no site quando o
              status estiver como “Publicado”.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-2 md:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name} className={`space-y-2 ${field.full ? "md:col-span-2" : ""}`}>
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required ? " *" : ""}
                </Label>

                {field.type === "textarea" || field.type === "longtext" ? (
                  <Textarea
                    id={field.name}
                    rows={field.type === "longtext" ? 10 : 3}
                    value={String(form[field.name] ?? "")}
                    onChange={(e) => setForm((p) => ({ ...p, [field.name]: e.target.value }))}
                  />
                ) : field.type === "select" ? (
                  <Select
                    value={String(form[field.name] ?? "")}
                    onValueChange={(value) => setForm((p) => ({ ...p, [field.name]: value }))}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {(field.options ?? []).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "switch" ? (
                  <div className="flex h-9 items-center">
                    <Switch
                      id={field.name}
                      checked={Boolean(form[field.name])}
                      onCheckedChange={(checked) =>
                        setForm((p) => ({ ...p, [field.name]: checked }))
                      }
                    />
                  </div>
                ) : field.type === "media" ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        id={field.name}
                        value={String(form[field.name] ?? "")}
                        onChange={(e) => setForm((p) => ({ ...p, [field.name]: e.target.value }))}
                        placeholder="caminho no storage ou URL"
                      />
                      <Button asChild variant="outline" size="sm" type="button">
                        <label className="cursor-pointer">
                          {uploading === field.name ? (
                            <Loader2 className="size-4 animate-spin" aria-hidden />
                          ) : (
                            <Upload className="size-4" aria-hidden />
                          )}
                          Enviar
                          <input
                            type="file"
                            className="sr-only"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) void handleUpload(field, file);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      </Button>
                    </div>
                    {field.help ? (
                      <p className="text-xs text-muted-foreground">{field.help}</p>
                    ) : null}
                  </div>
                ) : (
                  <Input
                    id={field.name}
                    type={
                      field.type === "date"
                        ? "date"
                        : field.type === "datetime"
                          ? "datetime-local"
                          : field.type === "number"
                            ? "number"
                            : "text"
                    }
                    value={formatInputValue(field, form[field.name])}
                    maxLength={field.type === "number" ? undefined : (field.maxLength ?? 255)}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        [field.name]:
                          field.type === "datetime" && e.target.value
                            ? new Date(e.target.value).toISOString()
                            : e.target.value,
                      }))
                    }
                  />
                )}

                {field.help && field.type !== "media" ? (
                  <p className="text-xs text-muted-foreground">{field.help}</p>
                ) : null}
              </div>
            ))}

            <div className="space-y-2">
              <Label htmlFor="status">Status de publicação</Label>
              <Select
                value={String(form['status'] ?? "rascunho")}
                onValueChange={(value) => setForm((p) => ({ ...p, status: value }))}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => save.mutate(form)} disabled={save.isPending || !canManage}>
              {save.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleting)} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Excluir “{String(deleting?.['titulo'] ?? "")}”?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O conteúdo será removido do site imediatamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleting && remove.mutate(deleting)}
              disabled={remove.isPending}
            >
              {remove.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function formatInputValue(field: FieldConfig, value: unknown): string {
  const raw = value == null ? "" : String(value);
  if (!raw) return "";
  if (field.type === "datetime") {
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  if (field.type === "date") return raw.slice(0, 10);
  return raw;
}
