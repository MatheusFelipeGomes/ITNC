import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

export interface AdminSession {
  userId: string;
  email: string;
  nome: string;
  roles: string[];
  isAdmin: boolean;
  isEditor: boolean;
  isGestor: boolean;
}

export function useAdminSession() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUserId(data.user?.id ?? null);
      setChecked(true);
      if (!data.user) navigate({ to: "/admin/login", replace: true });
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      setUserId(session?.user?.id ?? null);
      if (!session) navigate({ to: "/admin/login", replace: true });
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const profile = useQuery({
    queryKey: ["admin-profile", userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<AdminSession> => {
      const [{ data: perfil }, { data: rolesData }] = await Promise.all([
        supabase.from("profiles").select("nome, email").eq("id", userId!).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId!),
      ]);
      const roles = (rolesData ?? []).map((r) => String(r.role));
      return {
        userId: userId!,
        email: perfil?.email ?? "",
        nome: perfil?.nome || perfil?.email || "Gestor",
        roles,
        isAdmin: roles.includes("admin"),
        isEditor: roles.includes("editor"),
        isGestor: roles.length > 0,
      };
    },
  });

  return {
    checked,
    userId,
    session: profile.data,
    loading: !checked || profile.isLoading,
    canManage: Boolean(profile.data?.isGestor),
    isAdmin: Boolean(profile.data?.isAdmin),
  };
}
