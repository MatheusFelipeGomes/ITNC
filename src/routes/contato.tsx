import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — ITNC Incubadora" },
      {
        name: "description",
        content:
          "Fale com a equipe da incubadora do ITNC: dúvidas sobre editais, incubação, parcerias e inovação aberta.",
      },
      { property: "og:title", content: "Contato — ITNC Incubadora" },
      {
        property: "og:description",
        content: "Envie sua mensagem para a equipe da incubadora de empresas do ITNC.",
      },
    ],
  }),
  component: ContatoPage,
});

const contatoSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(120, "Nome muito longo"),
  email: z.string().trim().email("E-mail inválido").max(255),
  telefone: z.string().trim().max(40, "Telefone muito longo").optional(),
  assunto: z.string().trim().min(3, "Informe o assunto").max(150),
  mensagem: z.string().trim().min(10, "Descreva sua mensagem").max(2000),
});

type ContatoForm = z.infer<typeof contatoSchema>;

const EMPTY: ContatoForm = { nome: "", email: "", telefone: "", assunto: "", mensagem: "" };

function ContatoPage() {
  const [form, setForm] = useState<ContatoForm>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof ContatoForm, string>>>({});

  const mutation = useMutation({
    mutationFn: async (values: ContatoForm) => {
      const { error } = await supabase.from("contatos").insert({
        nome: values.nome,
        email: values.email,
        telefone: values.telefone || null,
        assunto: values.assunto,
        mensagem: values.mensagem,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setForm(EMPTY);
      toast.success("Mensagem enviada! Nossa equipe responderá em breve.");
    },
    onError: () => toast.error("Não foi possível enviar sua mensagem. Tente novamente."),
  });

  function update(field: keyof ContatoForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = contatoSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof ContatoForm, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContatoForm;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    mutation.mutate(parsed.data);
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Fale com a gente"
        title="Contato"
        description="Dúvidas sobre editais, incubação, parcerias ou visitas técnicas? Envie sua mensagem."
      />

      <section className="container-page grid gap-10 py-16 lg:grid-cols-[1fr_0.8fr]">
        <form onSubmit={handleSubmit} className="card-elevated rounded-2xl p-7 md:p-9" noValidate>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Nome" error={errors.nome}>
              <Input
                value={form.nome}
                onChange={(e) => update("nome", e.target.value)}
                maxLength={120}
                autoComplete="name"
              />
            </Field>
            <Field label="E-mail" error={errors.email}>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                maxLength={255}
                autoComplete="email"
              />
            </Field>
            <Field label="Telefone (opcional)" error={errors.telefone}>
              <Input
                value={form.telefone ?? ""}
                onChange={(e) => update("telefone", e.target.value)}
                maxLength={40}
                autoComplete="tel"
              />
            </Field>
            <Field label="Assunto" error={errors.assunto}>
              <Input
                value={form.assunto}
                onChange={(e) => update("assunto", e.target.value)}
                maxLength={150}
              />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Mensagem" error={errors.mensagem}>
              <Textarea
                value={form.mensagem}
                onChange={(e) => update("mensagem", e.target.value)}
                rows={6}
                maxLength={2000}
              />
            </Field>
          </div>

          <Button type="submit" size="lg" className="mt-7" disabled={mutation.isPending}>
            {mutation.isPending ? "Enviando..." : "Enviar mensagem"}
            <Send className="size-4" aria-hidden />
          </Button>
        </form>

        <aside className="space-y-4">
          {[
            { icon: MapPin, titulo: "Endereço", texto: "Campus de Inovação — Prédio do ITNC" },
            { icon: Mail, titulo: "E-mail", texto: "contato@itnc.org.br" },
            { icon: Phone, titulo: "Telefone", texto: "(00) 0000-0000" },
          ].map((item) => (
            <div key={item.titulo} className="card-elevated flex gap-4 rounded-2xl p-6">
              <span className="surface-highlight flex size-10 shrink-0 items-center justify-center rounded-lg">
                <item.icon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-semibold">{item.titulo}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.texto}</p>
              </div>
            </div>
          ))}
        </aside>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
