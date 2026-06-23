import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MessageCircle, PackageCheck, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/public/product-card";
import { ProductGallery } from "@/components/public/product-gallery";
import { ShareButton } from "@/components/public/share-button";
import { StoreHeader } from "@/components/public/store-header";
import { StoreFooter } from "@/components/public/store-footer";
import { FloatingWhatsAppButton } from "@/components/public/floating-whatsapp-button";
import { Reveal } from "@/components/motion/reveal";
import { formatCurrency } from "@/lib/utils";
import { productWhatsAppUrl } from "@/lib/whatsapp";
import { getProductByIdOrSlug, getStoreBySlug, getStoreProducts } from "@/lib/catalog-queries";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string; id: string }>;
}): Promise<Metadata> {
  const { slug, id } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) return {};
  const product = await getProductByIdOrSlug(store.id, id);
  if (!product) return {};
  return {
    title: product.name,
    description: product.short_description,
    openGraph: {
      title: `${product.name} | ${store.name}`,
      description: product.short_description,
      images: [product.image_url]
    }
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();
  const product = await getProductByIdOrSlug(store.id, id);
  if (!product) notFound();

  const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/loja/${store.slug}/produto/${product.slug}`;
  const products = await getStoreProducts(store.id);
  const related = products
    .filter((item) => item.id !== product.id && item.category_id === product.category_id)
    .slice(0, 3);

  return (
    <main className="overflow-hidden">
      <StoreHeader store={store} />
      <section className="container py-10">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[#5f6b7a]" aria-label="Breadcrumb">
          <Link href={`/loja/${store.slug}`} className="hover:text-foreground">Inicio</Link>
          <ChevronRight />
          <span>{product.category?.name}</span>
          <ChevronRight />
          <span className="text-foreground">{product.name}</span>
        </nav>
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1fr]">
          <Reveal>
            <ProductGallery name={product.name} images={[product.image_url, ...product.gallery_urls].filter(Boolean)} />
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col justify-center gap-7">
            <div className="flex flex-wrap gap-2">
              {product.is_promotion ? <Badge variant="promotion">Promocao</Badge> : null}
              {product.is_featured ? <Badge variant="success">Destaque</Badge> : null}
              <Badge variant={product.is_available ? "secondary" : "outline"}>
                {product.is_available ? "Disponivel" : "Indisponivel"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9c7a3b]">{product.category?.name}</p>
              <h1 className="mt-3 text-balance font-display text-5xl font-semibold leading-none tracking-normal sm:text-7xl">{product.name}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5f6b7a]">{product.short_description}</p>
            </div>
            <div className="flex items-end gap-3">
              <p className="text-4xl font-semibold">{formatCurrency(product.price)}</p>
              {product.compare_price ? (
                <p className="pb-1 text-lg text-[#5f6b7a] line-through">{formatCurrency(product.compare_price)}</p>
              ) : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-[#ead8bc] bg-[#fffaf3]/80 p-4 shadow-sm">
                <PackageCheck className="text-[#c9a66b]" />
                <div>
                  <p className="text-sm font-semibold">Atendimento direto</p>
                  <p className="text-xs text-[#5f6b7a]">Tire duvidas antes de comprar</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-[#ead8bc] bg-[#fffaf3]/80 p-4 shadow-sm">
                <Tag className="text-[#c9a66b]" />
                <div>
                  <p className="text-sm font-semibold">SKU {product.sku ?? "sob consulta"}</p>
                  <p className="text-xs text-[#5f6b7a]">Facilita a conversa com a loja</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {product.is_available ? (
                <Button asChild size="lg" variant="whatsapp" className="flex-1">
                  <a href={productWhatsAppUrl(store, product, productUrl)} target="_blank" rel="noreferrer">
                    <MessageCircle data-icon="inline-start" />
                    Tenho interesse no WhatsApp
                  </a>
                </Button>
              ) : (
                <Button size="lg" className="flex-1" disabled>
                  Produto indisponivel
                </Button>
              )}
              <ShareButton title={product.name} />
            </div>
            <div className="rounded-[1.5rem] border border-[#ead8bc] bg-[#f7efe3]/55 p-6">
              <h2 className="font-display text-3xl font-semibold">Descricao completa</h2>
              <p className="mt-3 leading-8 text-[#5f6b7a]">{product.description}</p>
            </div>
          </Reveal>
        </div>
      </section>
      {related.length ? (
        <section className="container py-20">
          <Reveal>
            <h2 className="font-display text-4xl font-semibold tracking-normal sm:text-5xl">Produtos relacionados</h2>
            <p className="mt-3 text-[#5f6b7a]">Outras opcoes da mesma categoria.</p>
          </Reveal>
          <div className="mt-9 grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} store={store} />
            ))}
          </div>
        </section>
      ) : null}
      <StoreFooter store={store} />
      <FloatingWhatsAppButton store={store} />
    </main>
  );
}
