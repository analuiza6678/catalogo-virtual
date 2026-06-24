import { AlertTriangle, CheckCircle2, Copy } from "lucide-react";
import type { SupabaseConfigStatus } from "@/lib/supabase/config";

const descriptions: Record<string, string> = {
  NEXT_PUBLIC_SUPABASE_URL: "URL do projeto Supabase",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "Chave anon public",
  NEXT_PUBLIC_SITE_URL: "URL publicada no Netlify",
  NEXT_PUBLIC_STORE_SLUG: "Slug maison-catalogo"
};

export function ConfigStatus({ config, schemaError }: { config: SupabaseConfigStatus; schemaError?: string }) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-white p-6 shadow-[0_20px_55px_rgba(58,46,40,0.1)]">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700"><AlertTriangle className="size-5" /></span>
        <div>
          <h2 className="text-lg font-bold">{schemaError ? "Schema do Supabase pendente" : "Supabase nao configurado"}</h2>
          <p className="mt-1 text-sm leading-6 text-[#7a746c]">
            {schemaError ? "A conexao respondeu, mas as tabelas da loja nao estao prontas." : "Adicione as variaveis abaixo no Netlify e publique novamente."}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-2">
        {Object.keys(descriptions).map((name) => {
          const failed = config.missing.includes(name) || config.invalid.includes(name);
          return (
            <div className="flex items-center justify-between gap-3 rounded-xl border bg-[#faf8f3] px-4 py-3" key={name}>
              <div className="min-w-0">
                <p className="truncate font-mono text-xs font-bold">{name}</p>
                <p className="mt-1 text-xs text-[#7a746c]">{descriptions[name]}</p>
              </div>
              {failed ? <AlertTriangle className="size-4 shrink-0 text-amber-700" /> : <CheckCircle2 className="size-4 shrink-0 text-emerald-700" />}
            </div>
          );
        })}
      </div>

      {schemaError ? <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs leading-5 text-red-700">Detalhe: {schemaError}</p> : null}
      <p className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#7a746c]"><Copy className="size-4" /> Nunca use service_role no frontend ou no Netlify.</p>
    </section>
  );
}

