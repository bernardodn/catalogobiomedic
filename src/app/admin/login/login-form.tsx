"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, LoaderCircle, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminSession } from "@/features/auth/use-admin-session";
import { DataError } from "@/lib/data/errors";

const loginSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe a senha."),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login } = useAdminSession();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function submit(values: LoginValues) {
    setFormError(null);
    try {
      await login(values.email, values.password);
      router.replace("/admin");
    } catch (error) {
      setFormError(
        error instanceof DataError ? error.message : "Não foi possível entrar agora.",
      );
    }
  }

  return (
    <div className="w-full max-w-md border bg-card p-7 sm:p-9">
      <div className="flex size-11 items-center justify-center rounded-sm bg-accent text-primary">
        <LockKeyhole className="size-5" aria-hidden="true" />
      </div>
      <h1 className="mt-7 text-3xl font-semibold tracking-tight text-brand-navy">
        Área administrativa
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Entre com suas credenciais para gerenciar o catálogo BioMedic.
      </p>

      <Alert className="mt-6 rounded-sm border-primary/25 bg-accent/60">
        <AlertDescription className="space-y-1 text-xs">
          <strong className="block text-foreground">Credenciais de demonstração</strong>
          <span className="block">admin@biomedic.demo</span>
          <span className="block">BioMedic@2026</span>
        </AlertDescription>
      </Alert>

      <form onSubmit={form.handleSubmit(submit)} className="mt-7 space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            className="rounded-sm"
            aria-invalid={Boolean(form.formState.errors.email)}
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            className="rounded-sm"
            aria-invalid={Boolean(form.formState.errors.password)}
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        {formError ? (
          <div role="alert" className="flex gap-2 text-sm text-destructive">
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {formError}
          </div>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-sm"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : null}
          Entrar
        </Button>
      </form>
    </div>
  );
}
