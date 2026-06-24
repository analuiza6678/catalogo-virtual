"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Gem, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductWithCategory, Store } from "@/types/catalog";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 }
};

export function HeroSection({ store }: { store: Store; featuredProducts: ProductWithCategory[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="inicio" className="relative overflow-hidden border-b border-[#3a2e28]/[0.06] bg-[linear-gradient(135deg,#faf8f3_0%,#fff_55%,#f8ece8_100%)]">
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(200,169,106,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(200,169,106,.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_right,transparent,black_45%,black_75%,transparent)]" />
      <div className="container relative grid items-center gap-12 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:py-20">
        <motion.div animate="visible" initial={reduceMotion ? false : "hidden"} variants={{ visible: { transition: { staggerChildren: 0.09 } } }}>
          <motion.div className="mb-6 h-px w-20 bg-gradient-to-r from-[#c8a96a] to-transparent" variants={reveal} />
          <motion.h1 className="max-w-[12ch] text-balance font-display text-[clamp(2.65rem,5.2vw,4.65rem)] font-medium leading-[1.02] text-[#3a2e28]" variants={reveal}>
            Pecas escolhidas para valorizar o seu estilo
          </motion.h1>
          <motion.p className="mt-6 max-w-[37rem] text-base leading-8 text-[#7a746c] sm:text-lg" variants={reveal}>
            Uma selecao delicada de acessorios para voce conhecer os detalhes e comprar com atendimento humano pelo WhatsApp.
          </motion.p>
          <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row" variants={reveal}>
            <Button asChild className="min-h-12 rounded-full bg-[#31523f] px-7 text-white hover:bg-[#183b2b]" size="lg">
              <a href="#produtos">Ver catalogo <ArrowDown data-icon="inline-end" /></a>
            </Button>
            <Button asChild className="min-h-12 rounded-full border-[#c8a96a]/35 bg-white px-7 text-[#31523f]" size="lg" variant="outline">
              <a href={buildWhatsAppUrl(store, `Ola! Vi o catalogo da ${store.name} e gostaria de atendimento.`)} rel="noreferrer" target="_blank"><MessageCircle data-icon="inline-start" />Falar no WhatsApp</a>
            </Button>
          </motion.div>
          <motion.p className="mt-6 text-sm font-medium leading-6 text-[#7a746c]" variants={reveal}>
            Atendimento humano · Produtos selecionados · Compra simples pelo WhatsApp
          </motion.p>
        </motion.div>

        <motion.div className="relative mx-auto w-full max-w-[34rem]" initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}>
          <motion.span animate={reduceMotion ? undefined : { y: [0, -7, 0] }} className="absolute -left-3 top-[17%] z-10 grid size-12 place-items-center rounded-2xl border border-[#c8a96a]/25 bg-white/90 text-[#c8a96a] shadow-sm" transition={{ duration: 5.4, repeat: Infinity }}><Sparkles className="size-5" /></motion.span>
          <motion.span animate={reduceMotion ? undefined : { y: [0, 7, 0] }} className="absolute -right-2 bottom-[20%] z-10 grid size-11 place-items-center rounded-full border border-[#c8a96a]/30 bg-[#e7d8bf]/80 text-[#31523f] shadow-sm" transition={{ duration: 6.2, repeat: Infinity }}><Gem className="size-4" /></motion.span>
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white bg-white p-2 shadow-[0_28px_70px_rgba(91,67,54,0.14)]">
            <Image alt="Modelo usando joias douradas da Maison Catalogo" className="rounded-[1.55rem] object-cover object-[50%_35%]" fill priority sizes="(max-width: 1024px) 100vw, 50vw" src="/images/maison-model-hero.jpg" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
