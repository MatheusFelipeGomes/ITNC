import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import logoItnc from "@/assets/logo_itnc.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="surface-navy mt-24">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-lg bg-primary-foreground/95">
              <img src={logoItnc.url} alt="Logotipo ITNC" className="size-9 object-contain" />
            </span>
            <p className="font-display text-lg font-bold">ITNC</p>
          </div>
          <p className="mt-3 max-w-xs text-sm text-primary-foreground/75">
            Incubadora de empresas, inovação e empreendedorismo. Apoiamos startups de base
            tecnológica desde a ideia até o crescimento sustentável.
          </p>
        </div>

        <nav aria-label="Links institucionais">
          <p className="font-display text-sm font-semibold">Navegação</p>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/75">
            <li>
              <Link to="/itnc/sobre" className="transition-colors hover:text-primary-foreground">
                Sobre a ITNC
              </Link>
            </li>
            <li>
              <Link to="/incubacao" className="transition-colors hover:text-primary-foreground">
                Incubação
              </Link>
            </li>
            <li>
              <Link to="/hdi" className="transition-colors hover:text-primary-foreground">
                HDI
              </Link>
            </li>
            <li>
              <Link to="/empresas" className="transition-colors hover:text-primary-foreground">
                Empresas incubadas
              </Link>
            </li>
            <li>
              <Link to="/resultados" className="transition-colors hover:text-primary-foreground">
                Resultados
              </Link>
            </li>
            <li>
              <Link to="/itnc/parceiros" className="transition-colors hover:text-primary-foreground">
                Parceiros
              </Link>
            </li>
            <li>
              <Link to="/noticias" className="transition-colors hover:text-primary-foreground">
                Notícias
              </Link>
            </li>
            <li>
              <Link to="/editais" className="transition-colors hover:text-primary-foreground">
                Editais
              </Link>
            </li>
            <li>
              <Link to="/eventos" className="transition-colors hover:text-primary-foreground">
                Eventos
              </Link>
            </li>
            <li>
              <Link to="/contato" className="transition-colors hover:text-primary-foreground">
                Contato
              </Link>
            </li>
          </ul>

        </nav>

        <div>
          <p className="font-display text-sm font-semibold">Contato</p>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/75">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              Campus de Inovação — Prédio do ITNC
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 size-4 shrink-0" aria-hidden />
              contato@itnc.org.br
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" aria-hidden />
              (00) 0000-0000
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-primary-foreground/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ITNC — Todos os direitos reservados.</p>
          <Link to="/admin/login" className="hover:text-primary-foreground">
            Área do gestor
          </Link>
        </div>
      </div>
    </footer>
  );
}
