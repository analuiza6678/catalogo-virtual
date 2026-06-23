import Link from "next/link";
import { LockKeyhole, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { loginAction, signupAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginPageProps = {
  searchParams: Promise<{ mode?: string; error?: string; status?: string }>;
};

const errors: Record<string, string> = {
  invalid: "Preencha o e-mail e use uma senha com pelo menos 8 caracteres.",
  credentials: "E-mail ou senha incorretos.",
  signup: "Confira o e-mail, a senha e a confirmacao informados.",
  account: "Nao foi possivel criar a conta. A loja pode ja possuir um proprietario.",
  config: "O painel ainda nao foi conectado ao Supabase. Configure as variaveis de ambiente antes de publicar.",
  store: "A conta foi autenticada, mas a loja nao foi criada. Execute o schema atualizado no Supabase."
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const registering = params.mode === "register";

  return (
    <main className="grid min-h-screen place-items-center bg-secondary/60 p-4 premium-grid">
      <Card className="w-full max-w-md rounded-lg bg-white/95 shadow-premium backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-lg bg-foreground text-background">
            {registering ? <Sparkles /> : <ShieldCheck />}
          </div>
          <CardTitle className="text-2xl">{registering ? "Criar conta do proprietario" : "Entrar no painel"}</CardTitle>
          <CardDescription>
            {registering
              ? "Crie o acesso privado usado para administrar produtos e configuracoes."
              : "Gerencie produtos, categorias e configuracoes da loja."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {params.error && errors[params.error] ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700" role="alert">
              {errors[params.error]}
            </div>
          ) : null}
          {params.status === "confirm" ? (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800" role="status">
              Conta criada. Confirme o e-mail recebido antes de entrar.
            </div>
          ) : null}
          {params.status === "verified" ? (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800" role="status">
              E-mail confirmado. Agora voce pode entrar.
            </div>
          ) : null}

          <form action={registering ? signupAction : loginAction} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <Label>E-mail</Label>
              <span className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-10" autoComplete="email" name="email" type="email" placeholder="voce@loja.com" required />
              </span>
            </label>
            <label className="flex flex-col gap-2">
              <Label>Senha</Label>
              <span className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-10" autoComplete={registering ? "new-password" : "current-password"} minLength={8} name="password" type="password" required />
              </span>
            </label>
            {registering ? (
              <label className="flex flex-col gap-2">
                <Label>Confirmar senha</Label>
                <Input autoComplete="new-password" minLength={8} name="confirmPassword" type="password" required />
              </label>
            ) : null}
            <Button type="submit" size="lg">{registering ? "Criar conta e continuar" : "Entrar"}</Button>
          </form>

          <div className="mt-5 border-t pt-5 text-center text-sm text-muted-foreground">
            {registering ? "Ja criou a conta?" : "Primeiro acesso da loja?"}{" "}
            <Link className="font-semibold text-foreground underline-offset-4 hover:underline" href={registering ? "/admin/login" : "/admin/login?mode=register"}>
              {registering ? "Entrar" : "Criar conta"}
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
