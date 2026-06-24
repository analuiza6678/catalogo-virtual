"use client";

import Image from "next/image";
import Link from "next/link";
import { X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProductWithCategory, Store } from "@/types/catalog";
import { formatCurrency } from "@/lib/utils";
import { productWhatsAppUrl } from "@/lib/whatsapp";

export function ProductDetailModal({
  product,
  store,
  related,
  onClose
}: {
  product: ProductWithCategory;
  store: Store;
  related: ProductWithCategory[];
  onClose: () => void;
}) {
  const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/loja/${store.slug}/produto/${product.slug}`;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#1F2937]/45 p-3 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[1.8rem] border border-[#E7D3B5] bg-[#FFFAF6] shadow-premium">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E7D3B5] bg-[#FFFAF6]/88 px-5 py-4 backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A8834A]">Detalhes do produto</p>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar detalhes">
            <X />
          </Button>
        </div>
        <div className="grid gap-7 p-5 md:grid-cols-[0.9fr_1fr] md:p-7">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#F8F1E8]">
            <Image src={product.image_url} alt={product.name} fill className="object-cover" />
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              {product.is_new ? <Badge variant="success">Novo</Badge> : null}
              {product.is_featured ? <Badge variant="success">Destaque</Badge> : null}
              {product.is_promotion ? <Badge variant="promotion">Promocao</Badge> : null}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A8834A]">{product.category?.name}</p>
              <h2 className="mt-2 font-display text-5xl font-semibold leading-none">{product.name}</h2>
              <p className="mt-4 leading-7 text-[#6B7280]">{product.description}</p>
            </div>
            <div className="flex items-end gap-3">
              <p className="text-3xl font-semibold">{formatCurrency(product.price)}</p>
              {product.compare_price ? <p className="pb-1 text-[#6B7280] line-through">{formatCurrency(product.compare_price)}</p> : null}
            </div>
            <div className="grid gap-3 rounded-[1.25rem] border border-[#E7D3B5] bg-[#F8F1E8]/70 p-4 text-sm sm:grid-cols-2">
              <Info label="Material" value={product.material} />
              <Info label="Cor" value={product.color} />
              <Info label="Tamanho" value={product.size} />
              <Info label="Estoque" value={product.stock != null ? `${product.stock} unidade(s)` : null} />
              <Info label="Observacoes" value={product.notes} />
            </div>
            {product.is_available ? (
              <Button asChild variant="whatsapp" size="lg">
                <a href={productWhatsAppUrl(store, product, productUrl)} target="_blank" rel="noreferrer">
                  <MessageCircle data-icon="inline-start" />
                  Tenho interesse no WhatsApp
                </a>
              </Button>
            ) : <Button disabled size="lg">Produto indisponivel</Button>}
            {related.length ? (
              <div>
                <p className="mb-3 text-sm font-semibold text-[#1F2937]">Combine tambem com</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {related.slice(0, 3).map((item) => (
                    <Link href={`/loja/${store.slug}/produto/${item.slug}`} key={item.id} className="rounded-2xl border border-[#E7D3B5] bg-[#FFFAF6] p-3 text-left text-sm transition hover:-translate-y-0.5 hover:shadow-sm">
                      <span className="block font-medium">{item.name}</span>
                      <span className="text-[#6B7280]">{formatCurrency(item.price)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A8834A]">{label}</p>
      <p className="mt-1 text-[#1F2937]">{value || "Sob consulta"}</p>
    </div>
  );
}
