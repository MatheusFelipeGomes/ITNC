import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu } from "lucide-react";

import logoItnc from "@/assets/logo_itnc.png.asset.json";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type NavItem =
  | { to: string; label: string; children?: undefined }
  | { label: string; children: { to: string; label: string }[]; to?: undefined };

const NAV: NavItem[] = [
  { to: "/", label: "Início" },
  {
    label: "ITNC",
    children: [
      { to: "/itnc/sobre", label: "Sobre a ITNC" },
      { to: "/itnc/parceiros", label: "Parceiros" },
    ],
  },
  { to: "/incubacao", label: "Incubação" },
  { to: "/hdi", label: "HDI" },
  { to: "/empresas", label: "Empresas Incubadas" },
  { to: "/resultados", label: "Resultados" },
  { to: "/editais", label: "Editais" },
  { to: "/noticias", label: "Notícias" },
  { to: "/eventos", label: "Eventos" },
  { to: "/contato", label: "Contato" },
];

const linkClass =
  "rounded-md px-2.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur transition-shadow">
      <div className="container-page grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <Link to="/" className="flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-90">
          <img src={logoItnc.url} alt="Logotipo ITNC" className="size-10 shrink-0 object-contain" />
          <span className="min-w-0 leading-tight">
            <span className="block font-display text-base font-bold tracking-tight">ITNC</span>
            <span className="block truncate text-[11px] font-medium text-muted-foreground">
              Incubadora e Inovação
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav aria-label="Navegação principal" className="hidden items-center gap-0.5 xl:flex">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.label} className="group relative">
                  <button
                    type="button"
                    className={`${linkClass} inline-flex items-center gap-1 group-hover:bg-secondary group-hover:text-foreground`}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDown
                      className="size-3.5 transition-transform duration-200 group-hover:rotate-180"
                      aria-hidden
                    />
                  </button>
                  <div className="invisible absolute left-0 top-full w-52 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <div className="card-elevated overflow-hidden rounded-xl p-1.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                          activeProps={{ className: "bg-secondary text-foreground" }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className={linkClass}
                  activeProps={{ className: "bg-secondary text-foreground" }}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <Button asChild size="sm" className="hidden shrink-0 sm:inline-flex">
            <Link to="/contato">Fale conosco</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="xl:hidden" aria-label="Abrir menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto">
              <nav aria-label="Navegação principal" className="mt-10 flex flex-col gap-1 px-4 pb-8">
                {NAV.map((item) =>
                  item.children ? (
                    <div key={item.label} className="mt-2">
                      <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </p>
                      {item.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          onClick={() => setOpen(false)}
                          className="block rounded-md px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                          activeProps={{ className: "bg-secondary text-foreground" }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      activeOptions={{ exact: item.to === "/" }}
                      activeProps={{ className: "bg-secondary text-foreground" }}
                    >
                      {item.label}
                    </Link>
                  ),
                )}
                <Button asChild className="mt-5">
                  <Link to="/contato" onClick={() => setOpen(false)}>
                    Fale conosco
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
