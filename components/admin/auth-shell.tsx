import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export function AuthShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  const storeSlug = process.env.NEXT_PUBLIC_STORE_SLUG ?? "maison-catalogo";
  return (
    <main className="min-h-screen bg-[linear-gradient(145deg,#faf8f3_0%,#fff_48%,#f4e8e3_100%)] px-5 py-8 text-[#3a2e28] sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link className="flex items-center gap-3" href={`/loja/${storeSlug}`}>
          <span className="grid size-11 place-items-center rounded-full bg-[#31523f] text-xs font-black tracking-[0.16em] text-white">MC</span>
          <span className="font-display text-xl font-semibold sm:text-2xl">Maison Catalogo</span>
        </Link>
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-[#31523f]" href={`/loja/${storeSlug}`}>
          <ArrowLeft className="size-4" /> <span className="hidden sm:inline">Voltar a loja</span>
        </Link>
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-7rem)] w-full max-w-5xl items-center gap-10 py-10 lg:grid-cols-[1fr_27rem]">
        <section className="max-w-xl">
          <span className="mb-6 grid size-12 place-items-center rounded-2xl border border-[#c8a96a]/30 bg-white text-[#31523f] shadow-sm">
            <Sparkles className="size-5" />
          </span>
          <h1 className="font-display text-[clamp(2.75rem,6vw,5rem)] font-medium leading-[0.98]">{title}</h1>
          <p className="mt-5 max-w-lg text-base leading-8 text-[#7a746c]">{description}</p>
        </section>
        {children}
      </div>
    </main>
  );
}
