import { KeyRound } from "lucide-react";
import { updatePasswordAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-secondary/60 p-4 premium-grid">
      <Card className="w-full max-w-md rounded-lg bg-white/95 shadow-premium backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-lg bg-foreground text-background">
            <KeyRound />
          </div>
          <CardTitle className="text-2xl">Criar nova senha</CardTitle>
          <CardDescription>Use pelo menos 8 caracteres e guarde sua nova senha.</CardDescription>
        </CardHeader>
        <CardContent>
          {params.error ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700" role="alert">
              Nao foi possivel atualizar a senha. Solicite um novo link de recuperacao.
            </div>
          ) : null}
          <form action={updatePasswordAction} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <Label>Nova senha</Label>
              <Input autoComplete="new-password" minLength={8} name="password" type="password" required />
            </label>
            <label className="flex flex-col gap-2">
              <Label>Confirmar nova senha</Label>
              <Input autoComplete="new-password" minLength={8} name="confirmPassword" type="password" required />
            </label>
            <Button size="lg" type="submit">Atualizar senha</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
