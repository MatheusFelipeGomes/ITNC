import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

type Papel = "admin" | "editor";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  roles: Papel[];
}

export function UsuariosManager() {
  const queryClient = useQueryClient();
  const { isAdmin } = useAdminSession();
  const [busca, setBusca] = useState("");
  const [novoPapel, setNovoPapel] = useState<Record<string, Papel>>({});

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "usuarios"],
    queryFn: async (): Promise<Usuario[]> => {
      const [{ data: perfis, error: erroPerfis }, { data: papeis, error: erroPapeis }] =
        await Promise.all([
          supabase.from("profiles").select("id,nome,email").order("nome"),
          supabase.from("user_roles").select("user_id,role"),
        ]);
      if (erroPerfis) throw erroPerfis;
      if (erroPapeis) throw erroPapeis;
      return (perfis ?? []).map((perfil) => ({
        id: perfil.id,
        nome: perfil.nome || perfil.email || "Sem nome",
        email: perfil.email ?? "",
        roles: (papeis ?? [])
          .filter((papel) => papel.user_id === perfil.id)
          .map((papel) => papel.role as Papel),
      }));
    },
  });

  const conceder = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: Papel }) => {
      if (!isAdmin) throw new Error("Somente administradores alteram permissões.");
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "usuarios"] });
      toast.success("Permissão concedida.");
    },
    onError: (error: Error) => toast.error(error.message || "Não foi possível conceder."),
  });

  const revogar = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: Papel }) => {
      if (!isAdmin) throw new Error("Somente administradores alteram permissões.");
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "usuarios"] });
      toast.success("Permissão removida.");
    },
    onError: (error: Error) => toast.error(error.message || "Não foi possível remover."),
  });

  const filtrados = (data ?? []).filter((usuario) => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return true;
    return `${usuario.nome} ${usuario.email}`.toLowerCase().includes(termo);
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-border bg-background p-10 text-center">
        <p className="text-sm text-muted-foreground">Não foi possível carregar os usuários.</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => void refetch()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Input
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar por nome ou e-mail..."
        aria-label="Buscar usuário"
        className="max-w-sm"
      />

      <div className="overflow-hidden rounded-xl border border-border bg-background">
        {filtrados.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto size-8 text-muted-foreground" aria-hidden />
            <p className="mt-3 text-sm font-medium">Nenhum usuário encontrado</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Novos usuários aparecem aqui após o primeiro acesso.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Permissões</TableHead>
                  <TableHead className="text-right">Conceder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>
                      <p className="font-medium">{usuario.nome}</p>
                      <p className="text-xs text-muted-foreground">{usuario.email}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {usuario.roles.length === 0 ? (
                          <span className="text-sm text-muted-foreground">Somente leitura</span>
                        ) : (
                          usuario.roles.map((role) => (
                            <Badge key={role} variant="secondary" className="capitalize">
                              {role}
                              {isAdmin ? (
                                <button
                                  type="button"
                                  className="ml-1 text-xs underline"
                                  onClick={() => revogar.mutate({ userId: usuario.id, role })}
                                >
                                  remover
                                </button>
                              ) : null}
                            </Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Select
                          value={novoPapel[usuario.id] ?? "editor"}
                          onValueChange={(value) =>
                            setNovoPapel((p) => ({ ...p, [usuario.id]: value as Papel }))
                          }
                        >
                          <SelectTrigger className="w-32" aria-label="Selecionar permissão">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!isAdmin || conceder.isPending}
                          onClick={() =>
                            conceder.mutate({
                              userId: usuario.id,
                              role: novoPapel[usuario.id] ?? "editor",
                            })
                          }
                        >
                          {conceder.isPending ? (
                            <Loader2 className="size-4 animate-spin" aria-hidden />
                          ) : (
                            <UserPlus className="size-4" aria-hidden />
                          )}
                          Conceder
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

      {!isAdmin ? (
        <p className="text-sm text-muted-foreground">
          Apenas administradores podem conceder ou remover permissões.
        </p>
      ) : null}
    </div>
  );
}
