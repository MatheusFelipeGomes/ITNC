import logoItnc from "@/assets/logo_itnc.png.asset.json";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Área do Gestor — ITNC" },
      { name: "description", content: "Acesso restrito ao painel de gestão de conteúdo do ITNC." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Área do Gestor — ITNC" },
      { property: "og:description", content: "Acesso restrito ao painel administrativo do ITNC." },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255),
  senha: z.string().min(6, "A senha deve ter ao menos 6 caracteres").max(72),
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  const mutation = useMutation({
    mutationFn: async (values: { email: string; senha: string }) => {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.senha,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Bem-vindo de volta!");
      navigate({ to: "/admin", replace: true });
    },
    onError: () => setErro("E-mail ou senha inválidos."),
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = schema.safeParse({ email, senha });
    if (!parsed.success) {
      setErro(parsed.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }
    setErro(null);
    mutation.mutate(parsed.data);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="surface-navy hidden flex-col justify-between p-12 lg:flex">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/95">
            <img src={logoItnc.url} alt="Logotipo ITNC" className="size-7 object-contain" />
          </span>
          <span className="font-display text-base font-bold">ITNC</span>
        </Link>
        <div>
          <h2 className="max-w-md font-display text-3xl font-bold leading-tight">
            Gestão de conteúdo do ecossistema de inovação.
          </h2>
          <p className="mt-4 max-w-sm text-sm text-primary-foreground/75">
            Publique notícias, editais e eventos e acompanhe as mensagens recebidas pelo site
            institucional.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/50">Acesso restrito a gestores autorizados.</p>
      </div>

      <div className="flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-bold tracking-tight">Área do gestor</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre com seu e-mail e senha institucionais.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                maxLength={72}
              />
            </div>

            {erro ? <p className="text-sm font-medium text-destructive">{erro}</p> : null}

            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <Button asChild variant="ghost" className="mt-6 px-0 text-muted-foreground">
            <Link to="/">
              <ArrowLeft className="size-4" aria-hidden />
              Voltar ao site
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
