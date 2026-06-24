import Link from "next/link";
import { redirect } from "next/navigation";
import { KeyRound, LockKeyhole, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { loginAction, requestPasswordResetAction, signupAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{ mode?: string; error?: string; status?: string }>;
};

const errors: Record<string, string> = {
  invalid: "Preencha o e-mail e use uma senha com pelo menos 8 caracteres.",
  credentials: "E-mail ou senha incorretos. Se necessario, recupere sua senha.",
  signup: "Confira o e-mail, a senha e a confirmacao informados.",
  account: "Nao foi possivel criar a conta. Tente entrar ou recuperar sua senha.",
  "owner-exists": "A conta proprietaria ja foi criada. Entre com o e-mail cadastrado ou recupere a senha.",
  email: "Informe um e-mail valido.",
  reset: "Nao foi possivel enviar o e-mail agora. Aguarde um pouco e tente novamente.",
  "site-url": "A URL publica do site ainda nao foi configurada.",
  callback: "O link de acesso expirou ou e invalido. Solicite um novo e-mail.",
  schema: "A conexao funcionou, mas as tabelas da loja nao foram encontradas. Execute o arquivo supabase/schema.sql.",
  "owner-mismatch": "Este e-mail nao e o proprietario da loja existente. Use o e-mail cadastrado no Supabase.",
  "store-create": "A conta entrou, mas nao foi possivel criar a loja. Execute novamente o schema atualizado.",
  config: "O painel ainda nao foi conectado ao Supabase. Confira as variaveis de ambiente da publicacao.",
  store: "A conta foi autenticada, mas a loja nao foi criada. Execute o schema atualizado no Supabase."
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const requestedRegister = params.mode === "register";
  const forgot = params.mode === "forgot";

  if (requestedRegister) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { count } = await supabase.from("stores").select("id", { count: "exact", head: true });
      if (count && count > 0) redirect("/admin/login?error=owner-exists");
    }
  }

  const registering = requestedRegister && !forgot;
  const title = forgot ? "Recuperar acesso" : registering ? "Criar conta do proprietario" : "Entrar no painel";
  const description = forgot
    ? "Enviaremos um link seguro para criar uma nova senha."
    : registering
      ? "Crie o acesso privado usado para administrar produtos e configuracoes."
      : "Gerencie produtos, categorias e configuracoes da loja.";

  return (
    <main className="grid min-h-screen place-items-center bg-secondary/60 p-4 premium-grid">
      <Card className="w-full max-w-md rounded-lg bg-white/95 shadow-premium backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-lg bg-foreground text-background">
            {forgot ? <KeyRound /> : registering ? <Sparkles /> : <ShieldCheck />}
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {params.error && errors[params.error] ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700" role="alert">
              {errors[params.error]}
            </div>
          ) : null}
          {params.status === "confirm" ? <Success>Conta criada. Confirme o e-mail recebido antes de entrar.</Success> : null}
          {params.status === "verified" ? <Success>E-mail confirmado. Agora voce pode entrar.</Success> : null}
          {params.status === "reset-sent" ? <Success>Link enviado. Confira a caixa de entrada e o spam.</Success> : null}
          {params.status === "password-updated" ? <Success>Senha atualizada. Entre com a nova senha.</Success> : null}

          <form action={forgot ? requestPasswordResetAction : registering ? signupAction : loginAction} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <Label>E-mail</Label>
              <span className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-10" autoComplete="email" name="email" type="email" placeholder="voce@loja.com" required />
              </span>
            </label>
            {!forgot ? (
              <label className="flex flex-col gap-2">
                <Label>Senha</Label>
                <span className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-10" autoComplete={registering ? "new-password" : "current-password"} minLength={8} name="password" type="password" required />
                </span>
              </label>
            ) : null}
            {registering ? (
              <label className="flex flex-col gap-2">
                <Label>Confirmar senha</Label>
                <Input autoComplete="new-password" minLength={8} name="confirmPassword" type="password" required />
              </label>
            ) : null}
            <Button type="submit" size="lg">{forgot ? "Enviar link de recuperacao" : registering ? "Criar conta e continuar" : "Entrar"}</Button>
          </form>

          {!registering && !forgot ? (
            <Link className="mt-4 block text-center text-sm font-semibold text-foreground underline-offset-4 hover:underline" href="/admin/login?mode=forgot">
              Esqueci minha senha
            </Link>
          ) : null}

          <div className="mt-5 border-t pt-5 text-center text-sm text-muted-foreground">
            {forgot ? "Lembrou a senha?" : registering ? "Ja criou a conta?" : "Primeiro acesso da loja?"}{" "}
            <Link className="font-semibold text-foreground underline-offset-4 hover:underline" href={forgot || registering ? "/admin/login" : "/admin/login?mode=register"}>
              {forgot || registering ? "Entrar" : "Criar conta"}
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function Success({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800" role="status">{children}</div>;
}
