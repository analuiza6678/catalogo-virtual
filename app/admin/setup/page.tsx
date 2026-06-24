import { redirect } from "next/navigation";
import { LockKeyhole, Mail } from "lucide-react";
import { setupAdminAction } from "@/app/actions/auth";
import { AuthShell } from "@/components/admin/auth-shell";
import { ConfigStatus } from "@/components/admin/config-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAdminBootstrapState } from "@/lib/admin-auth";
import { adminErrorMessages } from "@/lib/admin-messages";

export default async function SetupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [params, bootstrap] = await Promise.all([searchParams, getAdminBootstrapState()]);
  if (bootstrap.kind === "ready") redirect("/admin/login?error=owner-exists");

  return (
    <AuthShell title="Crie o acesso do administrador" description="Este cadastro acontece uma unica vez. Depois dele, somente o e-mail proprietario podera acessar o painel.">
      {bootstrap.kind === "missing-config" ? <ConfigStatus config={bootstrap.config} /> : bootstrap.kind === "schema-error" ? (
        <ConfigStatus config={bootstrap.config} schemaError={bootstrap.detail} />
      ) : (
        <section className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-[0_20px_55px_rgba(58,46,40,0.1)] sm:p-8">
          <h2 className="text-xl font-bold">Primeiro acesso</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Crie seu e-mail e sua senha. Nao existe senha padrao.</p>
          {params.error && adminErrorMessages[params.error] ? <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700" role="alert">{adminErrorMessages[params.error]}</div> : null}
          <form action={setupAdminAction} className="mt-6 grid gap-4">
            <Field label="E-mail"><Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input autoComplete="email" className="pl-10" name="email" placeholder="voce@loja.com" required type="email" /></Field>
            <Field label="Senha"><LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input autoComplete="new-password" className="pl-10" minLength={8} name="password" required type="password" /></Field>
            <Field label="Confirmar senha"><LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input autoComplete="new-password" className="pl-10" minLength={8} name="confirmPassword" required type="password" /></Field>
            <Button className="mt-1 w-full" size="lg" type="submit">Criar acesso do administrador</Button>
          </form>
          <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">A loja e as categorias iniciais serao criadas automaticamente.</p>
        </section>
      )}
    </AuthShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2"><Label>{label}</Label><span className="relative">{children}</span></label>;
}

