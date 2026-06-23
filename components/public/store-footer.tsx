import Link from "next/link";
import { Gem, Instagram, MapPin, MessageCircle, Timer } from "lucide-react";
import type { Store } from "@/types/catalog";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function StoreFooter({ store }: { store: Store }) {
  const links = [
    ["Início", `/loja/${store.slug}`],
    ["Categorias", "#categorias"],
    ["Catálogo", "#produtos"],
    ["Kits", "#kits"],
    ["Contato", "#contato"]
  ];

  return (
    <footer id="contato" className="relative overflow-hidden border-t border-[#C7A06A]/25 bg-[#111827] text-[#FFFAF6]">
      <div className="absolute left-[-10rem] top-[-10rem] h-80 w-80 rounded-full bg-[#C7A06A]/12 blur-3xl" />
      <div className="absolute right-[-8rem] bottom-[-10rem] h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      <div className="container relative grid gap-10 py-16 lg:grid-cols-[1.35fr_0.75fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full border border-[#C7A06A]/35 bg-[#FFFAF6]/8 text-[#E4D1B7]">
              <Gem />
            </span>
            <div>
              <h2 className="font-display text-4xl font-semibold leading-none">{store.name}</h2>
              <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-[#C7A06A]">Catálogo digital</p>
            </div>
          </div>
          <p className="mt-6 max-w-md text-sm leading-7 text-[#FFFAF6]/70">{store.description}</p>
          <Button asChild variant="whatsapp" className="mt-7">
            <a href={buildWhatsAppUrl(store, `Ola! Quero atendimento da ${store.name}.`)} target="_blank" rel="noreferrer">
              <MessageCircle data-icon="inline-start" />
              Falar no WhatsApp
            </a>
          </Button>
        </div>
        <FooterColumn title="Navegação">
          {links.map(([label, href]) => (
            <Link key={label} href={href} className="transition hover:text-white">
              {label}
            </Link>
          ))}
        </FooterColumn>
        <FooterColumn title="Atendimento">
          {store.address ? <p className="flex gap-3"><MapPin className="text-[#C7A06A]" />{store.address}</p> : null}
          {store.business_hours ? <p className="flex gap-3"><Timer className="text-[#C7A06A]" />{store.business_hours}</p> : null}
          {store.instagram_url ? <a className="flex gap-3 transition hover:text-white" href={store.instagram_url} target="_blank" rel="noreferrer"><Instagram className="text-[#C7A06A]" />Instagram</a> : null}
        </FooterColumn>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C7A06A]">Maison Catalogo</p>
          <p className="mt-4 font-display text-3xl leading-9 text-white">
            Curadoria delicada para mulheres que valorizam elegância nos detalhes.
          </p>
        </div>
      </div>
      <div className="container relative border-t border-white/10 py-5 text-xs text-[#FFFAF6]/55">
        <div className="flex flex-col justify-between gap-2 sm:flex-row">
          <p>© 2026 Maison Catalogo. Todos os direitos reservados.</p>
          <p>Catálogo digital com atendimento pelo WhatsApp.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#C7A06A]">{title}</h3>
      <div className="grid gap-3 text-sm leading-6 text-[#FFFAF6]/70">{children}</div>
    </div>
  );
}
