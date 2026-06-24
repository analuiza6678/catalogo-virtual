import Link from "next/link";
import { redirect } from "next/navigation";
import { KeyRound, LockKeyhole, Mail } from "lucide-react";
import { loginAction, requestPasswordResetAction } from "@/app/actions/auth";
import { AuthShell } from "@/components/admin/auth-shell";
import { ConfigStatus } from "@/components/admin/config-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAdminBootstrapState } from "@/lib/admin-auth";
import { adminErrorMessages, adminSuccessMessages } from "@/lib/admin-messages";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ view?: string; error?: string; status?: string }> }) {
  const [params, bootstrap] = await Promise.all([searchParams, getAdminBootstrapState()]);
  if (bootstrap.kind === "needs-setup") redirect("/admin/setup");
  const forgot = params.view === "forgot";
  const title = forgot ? "Recupere seu acesso" : "Bem-vinda de volta";
  const description = forgot
    ? "Informe o e-mail do administrador. O Supabase enviara um link seguro para criar uma nova senha."
    : "Entre para atualizar produtos, categorias e as informacoes da sua loja.";

  return (
    <AuthShell title={title} description={description}>
      {bootstrap.kind === "missing-config" ? <ConfigStatus config={bootstrap.config} /> : bootstrap.kind === "schema-error" ? (
        <ConfigStatus config={bootstrap.config} schemaError={bootstrap.detail} />
      ) : (
        <section className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-[0_20px_55px_rgba(58,46,40,0.1)] sm:p-8">
          <h2 className="text-xl font-bold">{forgot ? "Esqueci minha senha" : "Entrar no painel"}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{forgot ? "O link de recuperacao expira por seguranca." : "Use o e-mail cadastrado no primeiro acesso."}</p>

          {params.error && adminErrorMessages[params.error] ? <Message tone="error">{adminErrorMessages[params.error]}</Message> : null}
          {params.status && adminSuccessMessages[params.status] ? <Message tone="success">{adminSuccessMessages[params.status]}</Message> : null}

          <form action={forgot ? requestPasswordResetAction : loginAction} className="mt-6 grid gap-4">
            <Field label="E-mail" icon={<Mail className="size-4" />}>
              <Input autoComplete="email" className="pl-10" name="email" placeholder="voce@loja.com" required type="email" />
            </Field>
            {!forgot ? (
              <Field label="Senha" icon={<LockKeyhole className="size-4" />}>
                <Input autoComplete="current-password" className="pl-10" minLength={8} name="password" required type="password" />
              </Field>
            ) : null}
            <Button className="mt-1 w-full" size="lg" type="submit">{forgot ? "Enviar link de recuperacao" : "Entrar"}</Button>
          </form>

          <div className="mt-5 flex flex-col items-center gap-3 border-t pt-5 text-sm">
            <Link className="font-semibold text-[#31523f] hover:underline" href={forgot ? "/admin/login" : "/admin/login?view=forgot"}>
              {forgot ? "Voltar para o login" : "Esqueci minha senha"}
            </Link>
          </div>
        </section>
      )}
    </AuthShell>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <label className="grid gap-2"><Label>{label}</Label><span className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>{children}</span></label>;
}

function Message({ tone, children }: { tone: "error" | "success"; children: React.ReactNode }) {
  return <div className={`mt-5 rounded-xl border p-3 text-sm font-medium ${tone === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`} role={tone === "error" ? "alert" : "status"}>{children}</div>;
}

