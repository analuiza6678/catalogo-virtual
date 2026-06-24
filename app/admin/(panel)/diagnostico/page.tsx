import { notFound } from "next/navigation";
import { CheckCircle2, CircleAlert } from "lucide-react";
import { getAuthenticatedUser } from "@/lib/admin-auth";
import { getSupabaseConfigStatus } from "@/lib/supabase/config";

export default async function DiagnosticPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  const config = getSupabaseConfigStatus();
  const { supabase, user } = await getAuthenticatedUser();
  const { data: store } = supabase && user
    ? await supabase.from("stores").select("id, slug").eq("owner_id", user.id).maybeSingle()
    : { data: null };

  const checks = [
    ["Supabase URL", Boolean(config.supabaseUrl)],
    ["Anon key", Boolean(config.anonKey)],
    ["Site URL", Boolean(config.siteUrl)],
    [`Slug: ${config.storeSlug}`, Boolean(config.storeSlug)],
    ["Usuario autenticado", Boolean(user)],
    ["Loja encontrada", Boolean(store)]
  ] as const;

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-3xl font-semibold">Diagnostico local</h2>
      <p className="mt-2 text-muted-foreground">Esta pagina existe apenas em desenvolvimento e nunca mostra chaves.</p>
      <div className="mt-6 overflow-hidden rounded-xl border bg-white">
        {checks.map(([label, ok]) => (
          <div className="flex items-center justify-between border-b px-5 py-4 last:border-0" key={label}>
            <span className="font-medium">{label}</span>
            {ok ? <CheckCircle2 className="size-5 text-emerald-600" /> : <CircleAlert className="size-5 text-amber-600" />}
          </div>
        ))}
      </div>
    </div>
  );
}
