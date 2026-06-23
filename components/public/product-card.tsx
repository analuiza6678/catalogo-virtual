"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Heart, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductWithCategory, Store } from "@/types/catalog";
import { formatCurrency } from "@/lib/utils";
import { productWhatsAppUrl } from "@/lib/whatsapp";

export function ProductCard({
  product,
  store,
  onQuickView,
  featuredLayout = false
}: {
  product: ProductWithCategory;
  store: Store;
  onQuickView?: (product: ProductWithCategory) => void;
  featuredLayout?: boolean;
}) {
  const [favorite, setFavorite] = useState(false);
  const productPath = `/loja/${store.slug}/produto/${product.slug}`;
  const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}${productPath}`;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`group overflow-hidden rounded-[1.8rem] border border-[#E4D1B7] bg-[#FFFAF6]/94 shadow-sm transition-shadow hover:shadow-premium ${
        featuredLayout ? "lg:row-span-2" : ""
      }`}
    >
      <Link href={productPath} className={`relative block overflow-hidden bg-[#F3ECE4] ${featuredLayout ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/34 via-transparent to-transparent opacity-75" />
        <div className="absolute inset-x-0 top-0 h-28 translate-y-[-70%] bg-white/30 blur-2xl transition-transform duration-700 group-hover:translate-y-0" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {product.is_new ? <ProductBadge>Novo</ProductBadge> : null}
          {product.is_promotion ? <ProductBadge tone="rose">Promoção</ProductBadge> : null}
          {product.is_featured ? <ProductBadge>Destaque</ProductBadge> : null}
          {!product.is_available ? <ProductBadge tone="dark">Indisponível</ProductBadge> : null}
        </div>
        <FavoriteButton active={favorite} onClick={() => setFavorite((value) => !value)} />
      </Link>

      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#A8834A]">
                <Sparkles className="size-3.5" />
                {product.category?.name}
              </p>
              <h3 className="mt-2 line-clamp-2 font-display text-2xl font-semibold leading-7 text-[#171717]">
                {product.name}
              </h3>
            </div>
            <PriceDisplay price={product.price} comparePrice={product.compare_price} />
          </div>
          <p className="line-clamp-2 text-sm leading-6 text-[#6B7280]">{product.short_description}</p>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {onQuickView ? (
            <Button type="button" variant="outline" className="h-11 border-[#E4D1B7]" onClick={() => onQuickView(product)}>
              <Eye data-icon="inline-start" />
              Ver detalhes
            </Button>
          ) : (
            <Button asChild variant="outline" className="h-11 border-[#E4D1B7]">
              <Link href={productPath}>
                <Eye data-icon="inline-start" />
                Ver detalhes
              </Link>
            </Button>
          )}
          <Button asChild variant="whatsapp" className="h-11 shadow-soft" disabled={!product.is_available}>
            <a href={productWhatsAppUrl(store, product, productUrl)} target="_blank" rel="noreferrer" aria-disabled={!product.is_available}>
              <MessageCircle data-icon="inline-start" />
              Tenho interesse
            </a>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

function ProductBadge({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "rose" | "dark" }) {
  const styles = {
    gold: "border-[#E4D1B7] bg-[#FFFAF6]/78 text-[#A8834A]",
    rose: "border-[#EFD9D1] bg-[#FFF4F1]/82 text-[#A15C52]",
    dark: "border-white/30 bg-[#171717]/70 text-white"
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] backdrop-blur ${styles[tone]}`}>
      {children}
    </span>
  );
}

function FavoriteButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
      className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-white/55 bg-[#FFFAF6]/78 text-[#A8834A] shadow-soft backdrop-blur transition hover:scale-105 hover:bg-white"
      aria-label="Favoritar produto"
    >
      <Heart className={active ? "fill-[#C7A06A]" : ""} />
    </button>
  );
}

function PriceDisplay({ price, comparePrice }: { price: number; comparePrice?: number | null }) {
  return (
    <div className="shrink-0 text-right">
      {comparePrice ? <p className="text-xs text-[#6B7280] line-through">{formatCurrency(comparePrice)}</p> : null}
      <p className="text-lg font-semibold text-[#171717]">{formatCurrency(price)}</p>
    </div>
  );
}
