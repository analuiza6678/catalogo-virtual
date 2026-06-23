import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-secondary/60 p-6 premium-grid">
      <section className="w-full max-w-lg rounded-lg border bg-white/90 p-8 text-center shadow-premium backdrop-blur">
        <div className="mx-auto flex size-14 items-center justify-center rounded-lg bg-secondary text-primary">
          <SearchX />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-normal">Pagina nao encontrada</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          O endereco acessado nao existe ou o produto nao esta mais disponivel neste catalogo.
        </p>
        <Button asChild className="mt-6">
          <Link href={`/loja/${process.env.NEXT_PUBLIC_STORE_SLUG ?? "maison-catalogo"}`}>Voltar ao catalogo</Link>
        </Button>
      </section>
    </main>
  );
}
