"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleDot, Gem, Menu, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Store } from "@/types/catalog";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function StoreHeader({ store }: { store: Store }) {
  const [open, setOpen] = useState(false);
  const nav = [
    ["Inicio", `/loja/${store.slug}`],
    ["Categorias", "#categorias"],
    ["Catalogo", "#produtos"],
    ["Kits", "#kits"],
    ["Contato", "#contato"]
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[#E7D6BF]/70 bg-[#FAF6F1]/82 backdrop-blur-xl">
      <div className="container flex min-h-[76px] items-center justify-between gap-4 py-3">
        <Link href={`/loja/${store.slug}`} className="flex items-center gap-3">
          <span className="relative flex size-11 items-center justify-center rounded-full border border-[#1A1A1A]/20 bg-[#1A1A1A] text-[#E7D6BF] shadow-soft">
            <Gem />
            <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full border border-[#FAF6F1] bg-[#C8A06A] text-[#1A1A1A]">
              <CircleDot className="size-2.5" />
            </span>
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-[1.7rem] font-semibold leading-none text-[#1A1A1A]">{store.name}</span>
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#A8834A]">Catalogo digital</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-[#6B7280] lg:flex">
          {nav.map(([label, href]) => (
            <a key={label} href={href} className="relative transition hover:-translate-y-0.5 hover:text-[#1A1A1A]">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="whatsapp" size="sm" className="hidden sm:inline-flex">
            <a href={buildWhatsAppUrl(store, `Ola! Quero falar com a ${store.name}.`)} target="_blank" rel="noreferrer">
              <MessageCircle data-icon="inline-start" />
              Falar no WhatsApp
            </a>
          </Button>
          <Button variant="outline" size="icon" className="lg:hidden" aria-label="Abrir menu" onClick={() => setOpen((value) => !value)}>
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-[#E7D6BF]/70 bg-[#FAF6F1]/96 lg:hidden">
          <nav className="container grid gap-2 py-4">
            {nav.map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-[#5f6b7a] transition hover:bg-[#F8F1E8] hover:text-[#1F2937]"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
