export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      atividades: {
        Row: {
          acao: string
          autor: string
          created_at: string
          entidade: string
          id: string
          registro_id: string | null
          titulo: string
          user_id: string | null
        }
        Insert: {
          acao: string
          autor?: string
          created_at?: string
          entidade: string
          id?: string
          registro_id?: string | null
          titulo?: string
          user_id?: string | null
        }
        Update: {
          acao?: string
          autor?: string
          created_at?: string
          entidade?: string
          id?: string
          registro_id?: string | null
          titulo?: string
          user_id?: string | null
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          chave: string
          created_at: string
          id: string
          updated_at: string
          valor: Json
        }
        Insert: {
          chave: string
          created_at?: string
          id?: string
          updated_at?: string
          valor?: Json
        }
        Update: {
          chave?: string
          created_at?: string
          id?: string
          updated_at?: string
          valor?: Json
        }
        Relationships: []
      }
      conquistas: {
        Row: {
          ano: number | null
          categoria: string
          conteudo: string
          created_at: string
          destaque: boolean
          id: string
          imagem_url: string | null
          publicado_em: string | null
          resumo: string
          slug: string
          status: string
          titulo: string
          updated_at: string
        }
        Insert: {
          ano?: number | null
          categoria?: string
          conteudo?: string
          created_at?: string
          destaque?: boolean
          id?: string
          imagem_url?: string | null
          publicado_em?: string | null
          resumo?: string
          slug: string
          status?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          ano?: number | null
          categoria?: string
          conteudo?: string
          created_at?: string
          destaque?: boolean
          id?: string
          imagem_url?: string | null
          publicado_em?: string | null
          resumo?: string
          slug?: string
          status?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      contatos: {
        Row: {
          assunto: string
          created_at: string
          email: string
          id: string
          lida: boolean
          mensagem: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          assunto?: string
          created_at?: string
          email: string
          id?: string
          lida?: boolean
          mensagem: string
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          assunto?: string
          created_at?: string
          email?: string
          id?: string
          lida?: boolean
          mensagem?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      editais: {
        Row: {
          arquivo_url: string | null
          conteudo: string
          created_at: string
          id: string
          inscricoes_fim: string | null
          inscricoes_inicio: string | null
          publicado_em: string | null
          resumo: string
          situacao: string
          slug: string
          status: string
          titulo: string
          updated_at: string
        }
        Insert: {
          arquivo_url?: string | null
          conteudo?: string
          created_at?: string
          id?: string
          inscricoes_fim?: string | null
          inscricoes_inicio?: string | null
          publicado_em?: string | null
          resumo?: string
          situacao?: string
          slug: string
          status?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          arquivo_url?: string | null
          conteudo?: string
          created_at?: string
          id?: string
          inscricoes_fim?: string | null
          inscricoes_inicio?: string | null
          publicado_em?: string | null
          resumo?: string
          situacao?: string
          slug?: string
          status?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      empresas: {
        Row: {
          ano_ingresso: number | null
          conteudo: string
          created_at: string
          destaque: boolean
          id: string
          imagem_url: string | null
          publicado_em: string | null
          resumo: string
          setor: string
          site_url: string | null
          situacao: string
          slug: string
          status: string
          titulo: string
          updated_at: string
        }
        Insert: {
          ano_ingresso?: number | null
          conteudo?: string
          created_at?: string
          destaque?: boolean
          id?: string
          imagem_url?: string | null
          publicado_em?: string | null
          resumo?: string
          setor?: string
          site_url?: string | null
          situacao?: string
          slug: string
          status?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          ano_ingresso?: number | null
          conteudo?: string
          created_at?: string
          destaque?: boolean
          id?: string
          imagem_url?: string | null
          publicado_em?: string | null
          resumo?: string
          setor?: string
          site_url?: string | null
          situacao?: string
          slug?: string
          status?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      equipe: {
        Row: {
          area: string
          cargo: string
          conteudo: string
          created_at: string
          destaque: boolean
          email: string
          id: string
          imagem_url: string | null
          linkedin_url: string
          ordem: number
          publicado_em: string | null
          resumo: string
          slug: string
          status: string
          titulo: string
          updated_at: string
        }
        Insert: {
          area?: string
          cargo?: string
          conteudo?: string
          created_at?: string
          destaque?: boolean
          email?: string
          id?: string
          imagem_url?: string | null
          linkedin_url?: string
          ordem?: number
          publicado_em?: string | null
          resumo?: string
          slug: string
          status?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          area?: string
          cargo?: string
          conteudo?: string
          created_at?: string
          destaque?: boolean
          email?: string
          id?: string
          imagem_url?: string | null
          linkedin_url?: string
          ordem?: number
          publicado_em?: string | null
          resumo?: string
          slug?: string
          status?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      eventos: {
        Row: {
          conteudo: string
          created_at: string
          fim: string | null
          id: string
          imagem_url: string | null
          inicio: string | null
          inscricao_url: string | null
          local: string
          publicado_em: string | null
          resumo: string
          slug: string
          status: string
          titulo: string
          updated_at: string
        }
        Insert: {
          conteudo?: string
          created_at?: string
          fim?: string | null
          id?: string
          imagem_url?: string | null
          inicio?: string | null
          inscricao_url?: string | null
          local?: string
          publicado_em?: string | null
          resumo?: string
          slug: string
          status?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          conteudo?: string
          created_at?: string
          fim?: string | null
          id?: string
          imagem_url?: string | null
          inicio?: string | null
          inscricao_url?: string | null
          local?: string
          publicado_em?: string | null
          resumo?: string
          slug?: string
          status?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      heroes: {
        Row: {
          ativo: boolean
          created_at: string
          cta_primario_label: string
          cta_primario_url: string
          cta_secundario_label: string
          cta_secundario_url: string
          destaque: boolean
          eyebrow: string
          id: string
          imagem_url: string | null
          ordem: number
          publicado_em: string | null
          slug: string
          status: string
          subtitulo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          cta_primario_label?: string
          cta_primario_url?: string
          cta_secundario_label?: string
          cta_secundario_url?: string
          destaque?: boolean
          eyebrow?: string
          id?: string
          imagem_url?: string | null
          ordem?: number
          publicado_em?: string | null
          slug: string
          status?: string
          subtitulo?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          cta_primario_label?: string
          cta_primario_url?: string
          cta_secundario_label?: string
          cta_secundario_url?: string
          destaque?: boolean
          eyebrow?: string
          id?: string
          imagem_url?: string | null
          ordem?: number
          publicado_em?: string | null
          slug?: string
          status?: string
          subtitulo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      indicadores: {
        Row: {
          created_at: string
          destaque: boolean
          id: string
          ordem: number
          publicado_em: string | null
          resumo: string
          slug: string
          status: string
          titulo: string
          updated_at: string
          valor: string
        }
        Insert: {
          created_at?: string
          destaque?: boolean
          id?: string
          ordem?: number
          publicado_em?: string | null
          resumo?: string
          slug: string
          status?: string
          titulo: string
          updated_at?: string
          valor?: string
        }
        Update: {
          created_at?: string
          destaque?: boolean
          id?: string
          ordem?: number
          publicado_em?: string | null
          resumo?: string
          slug?: string
          status?: string
          titulo?: string
          updated_at?: string
          valor?: string
        }
        Relationships: []
      }
      noticias: {
        Row: {
          autor_id: string | null
          categoria: string
          conteudo: string
          created_at: string
          destaque: boolean
          id: string
          imagem_url: string | null
          publicado_em: string | null
          resumo: string
          slug: string
          status: string
          titulo: string
          updated_at: string
        }
        Insert: {
          autor_id?: string | null
          categoria?: string
          conteudo?: string
          created_at?: string
          destaque?: boolean
          id?: string
          imagem_url?: string | null
          publicado_em?: string | null
          resumo?: string
          slug: string
          status?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          autor_id?: string | null
          categoria?: string
          conteudo?: string
          created_at?: string
          destaque?: boolean
          id?: string
          imagem_url?: string | null
          publicado_em?: string | null
          resumo?: string
          slug?: string
          status?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      paginas: {
        Row: {
          conteudo: string
          created_at: string
          id: string
          imagem_url: string | null
          publicado_em: string | null
          resumo: string
          slug: string
          status: string
          titulo: string
          updated_at: string
        }
        Insert: {
          conteudo?: string
          created_at?: string
          id?: string
          imagem_url?: string | null
          publicado_em?: string | null
          resumo?: string
          slug: string
          status?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          conteudo?: string
          created_at?: string
          id?: string
          imagem_url?: string | null
          publicado_em?: string | null
          resumo?: string
          slug?: string
          status?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      parceiros: {
        Row: {
          categoria: string
          created_at: string
          destaque: boolean
          id: string
          imagem_url: string | null
          publicado_em: string | null
          resumo: string
          site_url: string | null
          slug: string
          status: string
          titulo: string
          updated_at: string
        }
        Insert: {
          categoria?: string
          created_at?: string
          destaque?: boolean
          id?: string
          imagem_url?: string | null
          publicado_em?: string | null
          resumo?: string
          site_url?: string | null
          slug: string
          status?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          categoria?: string
          created_at?: string
          destaque?: boolean
          id?: string
          imagem_url?: string | null
          publicado_em?: string | null
          resumo?: string
          site_url?: string | null
          slug?: string
          status?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string
          id: string
          nome?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_gestor: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor"],
    },
  },
} as const
