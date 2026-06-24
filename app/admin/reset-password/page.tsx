import Link from "next/link";
import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { updatePasswordAction } from "@/app/actions/auth";
import { AuthShell } from "@/components/admin/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuthenticatedUser } from "@/lib/admin-auth";
import { adminErrorMessages } from "@/lib/admin-messages";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [params, auth] = await Promise.all([searchParams, getAuthenticatedUser()]);
  if (!auth.supabase) redirect("/admin/login?error=config");
  if (!auth.user) redirect("/admin/login?error=reset-session");

  return (
    <AuthShell title="Crie uma nova senha" description="Escolha uma senha segura para voltar ao painel da sua loja.">
      <section className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-[0_20px_55px_rgba(58,46,40,0.1)] sm:p-8">
        <h2 className="text-xl font-bold">Redefinir senha</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Use pelo menos 8 caracteres.</p>
        {params.error && adminErrorMessages[params.error] ? <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700" role="alert">{adminErrorMessages[params.error]}</div> : null}
        <form action={updatePasswordAction} className="mt-6 grid gap-4">
          <Field label="Nova senha"><LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input autoComplete="new-password" className="pl-10" minLength={8} name="password" required type="password" /></Field>
          <Field label="Confirmar nova senha"><LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input autoComplete="new-password" className="pl-10" minLength={8} name="confirmPassword" required type="password" /></Field>
          <Button className="mt-1 w-full" size="lg" type="submit">Salvar nova senha</Button>
        </form>
        <Link className="mt-5 block text-center text-sm font-semibold text-[#31523f] hover:underline" href="/admin/login">Cancelar e voltar</Link>
      </section>
    </AuthShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2"><Label>{label}</Label><span className="relative">{children}</span></label>;
}
