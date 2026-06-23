"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Gem, MessageCircle, Sparkles, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductWithCategory, Store } from "@/types/catalog";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { formatCurrency } from "@/lib/utils";

const campaignImage = "/images/maison-model-hero.jpg";

export function HeroSection({ store, featuredProducts }: { store: Store; featuredProducts: ProductWithCategory[] }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 24 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 24 });
  const imageX = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const imageY = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const floatProducts = featuredProducts.slice(0, 2);

  return (
    <section
      id="inicio"
      className="relative isolate overflow-hidden bg-[#FAF7F2]"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_14%,rgba(238,223,208,0.95),transparent_30rem),radial-gradient(circle_at_78%_12%,rgba(199,160,106,0.2),transparent_24rem),linear-gradient(180deg,#FAF7F2_0%,#F3ECE4_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.18] [background-image:linear-gradient(rgba(23,23,23,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(23,23,23,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />
      <FloatingElement className="left-[7%] top-24 h-px w-44 rotate-[-18deg] bg-[#171717]/18" />
      <FloatingElement className="right-[11%] top-28 h-24 w-24 rounded-full border border-[#C7A06A]/25" delay={0.3} />
      <FloatingElement className="bottom-24 left-[40%] h-28 w-28 rounded-[42%] border border-[#E4D1B7]/80" delay={0.8} />

      <div className="container relative grid min-h-[calc(100vh-4.75rem)] items-center gap-10 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:py-14">
        <motion.div
          className="flex flex-col gap-7"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex max-w-3xl flex-col gap-5">
            <div className="flex items-center gap-4">
              <span className="h-px w-14 bg-[#171717]" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A8834A]">
                Maison Catalogo
              </span>
            </div>
            <h1 className="max-w-3xl text-balance font-display text-5xl font-semibold leading-[0.93] text-[#171717] sm:text-6xl lg:text-[5.6rem]">
              Acessórios que elevam sua presença.
            </h1>
            <p className="max-w-xl text-base leading-8 text-[#6B7280] sm:text-lg">
              Peças selecionadas para realçar sua beleza com leveza, sofisticação e personalidade.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <AnimatedButton href={buildWhatsAppUrl(store, `Ola! Vim pelo catalogo da ${store.name}. Pode me atender?`)}>
              <MessageCircle data-icon="inline-start" />
              Comprar pelo WhatsApp
            </AnimatedButton>
            <Button asChild size="lg" variant="outline" className="group border-[#171717]/30 bg-[#FAF7F2]/65 px-7 text-[#171717] hover:bg-[#171717] hover:text-white">
              <a href="#produtos">
                Ver catálogo
                <ArrowRight data-icon="inline-end" className="transition group-hover:translate-x-1" />
              </a>
            </Button>
          </div>

          <TrustBadges />
        </motion.div>

        <motion.div
          className="relative min-h-[520px] lg:min-h-[660px]"
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div style={{ x: imageX, y: imageY }} className="absolute right-0 top-4 h-[88%] w-[82%] border border-[#171717]/14 bg-[#F3ECE4]" />
          <motion.div
            style={{ x: imageX, y: imageY }}
            className="absolute right-6 top-8 h-[84%] w-[80%] overflow-hidden rounded-[2.2rem] rounded-t-[11rem] border border-[#E4D1B7] bg-[#F3ECE4] shadow-premium"
          >
            <Image
              src={campaignImage}
              alt="Mulher elegante usando acessórios femininos Maison Catalogo"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/30 via-transparent to-[#FAF7F2]/8" />
          </motion.div>

          <HeroProductCards products={floatProducts} />

          <FloatingElement className="right-2 top-20 hidden rounded-full border border-[#C7A06A]/40 bg-[#FFFAF6]/82 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#171717] shadow-soft backdrop-blur md:block" delay={0.4}>
            Curadoria premium
          </FloatingElement>
          <FloatingElement className="bottom-20 right-3 hidden rounded-full border border-[#E4D1B7] bg-[#FAF7F2]/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#A8834A] shadow-soft backdrop-blur md:block" delay={0.9}>
            Novidades da semana
          </FloatingElement>
        </motion.div>
      </div>
    </section>
  );
}

function AnimatedButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-[#16A34A] px-7 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-[#128C3F] hover:shadow-premium"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="absolute inset-y-0 -left-16 w-14 rotate-12 bg-white/22 blur-sm transition-transform duration-700 hover:translate-x-72" />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </motion.a>
  );
}

function FloatingElement({
  className,
  children,
  delay = 0
}: {
  className: string;
  children?: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: [0, -10, 0] }}
      transition={{ opacity: { duration: 0.5, delay }, y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay } }}
    >
      {children}
    </motion.div>
  );
}

function TrustBadges() {
  const items = [
    ["Curadoria premium", Gem],
    ["Atendimento humano", MessageCircle],
    ["Compra fácil", Sparkles],
    ["Entrega cuidadosa", Truck]
  ];

  return (
    <div className="grid max-w-2xl grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map(([label, Icon], index) => (
        <motion.div
          key={label as string}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.08, duration: 0.5 }}
          className="group rounded-[1.1rem] border border-[#E4D1B7] bg-[#FFFAF6]/76 p-3 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-[#C7A06A] hover:shadow-soft"
        >
          <span className="mb-3 flex size-9 items-center justify-center rounded-full border border-[#C7A06A]/35 bg-[#FAF7F2] text-[#171717]">
            <Icon />
          </span>
          <p className="text-sm font-semibold leading-5 text-[#374151]">{label as string}</p>
        </motion.div>
      ))}
    </div>
  );
}

function HeroProductCards({ products }: { products: ProductWithCategory[] }) {
  if (!products.length) return null;

  return (
    <div className="absolute bottom-8 left-0 grid max-w-[300px] gap-3">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          className="grid grid-cols-[64px_1fr] gap-3 rounded-[1.25rem] border border-[#E4D1B7] bg-[#FFFAF6]/88 p-3 shadow-premium backdrop-blur-xl"
          initial={{ opacity: 0, x: -18, y: 16 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.45 + index * 0.12, duration: 0.55 }}
          whileHover={{ y: -4 }}
        >
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F3ECE4]">
            <Image src={product.image_url} alt={product.name} fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold uppercase tracking-[0.18em] text-[#A8834A]">Peças selecionadas</p>
            <p className="mt-1 truncate font-display text-xl font-semibold text-[#171717]">{product.name}</p>
            <p className="text-sm font-semibold text-[#374151]">{formatCurrency(product.price)}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
