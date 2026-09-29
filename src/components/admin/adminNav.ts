import {
  Award,
  BarChart3,
  Building2,
  CalendarDays,
  FileImage,
  FileText,
  Files,
  Globe,
  Handshake,
  Home,
  Image,
  KeyRound,
  LayoutDashboard,
  Mail,
  Newspaper,
  Rocket,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCog,
  Users,
} from "lucide-react";

export interface AdminNavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  adminOnly?: boolean;
}

export interface AdminNavGroup {
  label: string | null;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: null,
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Conteúdo",
    items: [
      { to: "/admin/noticias", label: "Notícias", icon: Newspaper },
      { to: "/admin/editais", label: "Editais", icon: FileText },
      { to: "/admin/eventos", label: "Eventos", icon: CalendarDays },
      { to: "/admin/parceiros", label: "Parceiros", icon: Handshake },
      { to: "/admin/equipe", label: "Equipe", icon: Users },
      { to: "/admin/empresas", label: "Empresas Incubadas", icon: Building2 },
      { to: "/admin/resultados", label: "Resultados", icon: BarChart3 },
      { to: "/admin/conquistas", label: "Conquistas", icon: Trophy },
      { to: "/admin/premiacoes", label: "Premiações", icon: Award },
    ],
  },
  {
    label: "Institucional",
    items: [
      { to: "/admin/hero", label: "Página inicial", icon: Sparkles },
      { to: "/admin/institucional/sobre", label: "Sobre a ITNC", icon: Home },
      { to: "/admin/institucional/incubacao", label: "Incubação", icon: Rocket },
      { to: "/admin/institucional/hdi", label: "HDI", icon: Globe },
      { to: "/admin/mensagens", label: "Contato", icon: Mail },
    ],
  },
  {
    label: "Mídia",
    items: [
      { to: "/admin/midia/imagens", label: "Biblioteca de imagens", icon: Image },
      { to: "/admin/midia/documentos", label: "Documentos", icon: Files },
      { to: "/admin/midia/pdfs", label: "PDFs", icon: FileImage },
    ],
  },
  {
    label: "Usuários",
    items: [
      { to: "/admin/usuarios", label: "Usuários", icon: Users, adminOnly: true },
      { to: "/admin/perfis", label: "Perfis", icon: UserCog },
      { to: "/admin/permissoes", label: "Permissões", icon: ShieldCheck },
    ],
  },
  {
    label: "Configurações",
    items: [
      { to: "/admin/config/institucional", label: "Informações institucionais", icon: Settings },
      { to: "/admin/config/redes-sociais", label: "Redes sociais", icon: Share2 },
      { to: "/admin/config/seo", label: "SEO", icon: Search },
      { to: "/admin/config/geral", label: "Configurações gerais", icon: KeyRound },
    ],
  },
];
