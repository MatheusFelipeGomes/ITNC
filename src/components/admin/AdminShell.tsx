import logoItnc from "@/assets/logo_itnc.png.asset.json";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ExternalLink, LogOut, Menu, ShieldAlert } from "lucide-react";
import { type ReactNode, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { ADMIN_NAV } from "@/components/admin/adminNav";
import { useAdminSession } from "@/hooks/useAdminSession";
import { supabase } from "@/integrations/supabase/client";

export function AdminShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { session, loading, canManage, isAdmin } = useAdminSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  const nav = (
    <nav className="space-y-6">
      {ADMIN_NAV.map((group, index) => {
        const items = group.items.filter((item) => !item.adminOnly || isAdmin);
        if (items.length === 0) return null;
        return (
          <div key={group.label ?? `group-${index}`}>
            {group.label ? (
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground/45">
                {group.label}
              </p>
            ) : null}
            <div className="space-y-0.5">
              {items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: Boolean(item.exact) }}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  activeProps={{ className: "bg-primary-foreground/15 text-primary-foreground" }}
                >
                  <item.icon className="size-4 shrink-0" aria-hidden />
                  <span className="truncate">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );

  const sidebarContent = (
    <div className="surface-navy flex h-full flex-col">
      <div className="p-6 pb-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/95">
            <img src={logoItnc.url} alt="Logotipo ITNC" className="size-7 object-contain" />
          </span>
          <span>
            <span className="block font-display text-sm font-bold">ITNC CMS</span>
            <span className="block text-[11px] text-primary-foreground/65">Painel do gestor</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-6">{nav}</div>

      <div className="border-t border-primary-foreground/15 p-4">
        <p className="truncate text-sm font-medium">{session?.nome ?? "—"}</p>
        <p className="truncate text-xs text-primary-foreground/60">{session?.email ?? ""}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {(session?.roles ?? []).length === 0 ? (
            <Badge variant="secondary" className="text-[10px]">
              Sem permissão
            </Badge>
          ) : (
            session!.roles.map((role) => (
              <Badge key={role} variant="secondary" className="text-[10px] capitalize">
                {role}
              </Badge>
            ))
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="mt-3 w-full border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          <LogOut className="size-4" aria-hidden />
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-secondary/40">
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-0 h-screen">{sidebarContent}</div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden" aria-label="Abrir menu">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 border-0 p-0">
                  {sidebarContent}
                </SheetContent>
              </Sheet>
              <div className="min-w-0">
                <h1 className="truncate font-display text-xl font-bold tracking-tight sm:text-2xl">
                  {title}
                </h1>
                {description ? (
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">{description}</p>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {actions}
              <Button asChild variant="outline" size="sm">
                <a href="/" target="_blank" rel="noreferrer">
                  <ExternalLink className="size-4" aria-hidden />
                  Ver site
                </a>
              </Button>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <div className="space-y-5">
              {!canManage ? (
                <Alert variant="destructive">
                  <ShieldAlert className="size-4" />
                  <AlertTitle>Acesso somente leitura</AlertTitle>
                  <AlertDescription>
                    Sua conta não possui perfil de gestor. Solicite a um administrador a permissão
                    para criar, editar ou remover conteúdos.
                  </AlertDescription>
                </Alert>
              ) : null}
              {children}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
