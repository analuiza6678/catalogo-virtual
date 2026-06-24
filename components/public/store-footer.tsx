import Link from "next/link";
import { Instagram, MapPin, MessageCircle, Timer } from "lucide-react";
import type { Store } from "@/types/catalog";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function StoreFooter({ store }: { store: Store }) {
  return (
    <footer id="contato" className="border-t border-[#c8a96a]/25 bg-[#f3ece4] text-[#3a2e28]">
      <div className="container grid gap-10 py-14 lg:grid-cols-[1.2fr_0.7fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-[#31523f] text-xs font-black tracking-[0.16em] text-white">MC</span>
            <h2 className="font-display text-3xl font-semibold">{store.name}</h2>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#7a746c]">{store.description}</p>
          <Button asChild className="mt-6 rounded-full bg-[#31523f] text-white hover:bg-[#183b2b]">
            <a href={buildWhatsAppUrl(store, `Ola! Quero atendimento da ${store.name}.`)} target="_blank" rel="noreferrer"><MessageCircle data-icon="inline-start" />Falar no WhatsApp</a>
          </Button>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#a8834a]">Navegacao</h3>
          <nav className="mt-5 grid gap-3 text-sm font-medium text-[#7a746c]">
            <Link href={`/loja/${store.slug}`}>Inicio</Link><a href="#categorias">Categorias</a><a href="#produtos">Catalogo</a><a href="#contato">Contato</a>
          </nav>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#a8834a]">Atendimento</h3>
          <div className="mt-5 grid gap-4 text-sm leading-6 text-[#7a746c]">
            {store.address ? <p className="flex gap-3"><MapPin className="size-5 shrink-0 text-[#31523f]" />{store.address}</p> : null}
            {store.business_hours ? <p className="flex gap-3"><Timer className="size-5 shrink-0 text-[#31523f]" />{store.business_hours}</p> : null}
            {store.instagram_url ? <a className="flex gap-3" href={store.instagram_url} target="_blank" rel="noreferrer"><Instagram className="size-5 shrink-0 text-[#31523f]" />Instagram</a> : null}
          </div>
        </div>
      </div>
      <div className="border-t border-[#c8a96a]/20 py-5 text-center text-xs text-[#7a746c]">© 2026 Maison Catalogo. Compra finalizada pelo WhatsApp.</div>
    </footer>
  );
}
