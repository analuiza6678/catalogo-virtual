import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogClient } from "@/components/public/catalog-client";
import { FloatingWhatsAppButton } from "@/components/public/floating-whatsapp-button";
import { HeroSection } from "@/components/public/hero-section";
import { StoreFooter } from "@/components/public/store-footer";
import { StoreHeader } from "@/components/public/store-header";
import { CategoryShowcase } from "@/components/public/category-showcase";
import { KitsSection } from "@/components/public/editorial-sections";
import { getStoreBySlug, getStoreCategories, getStoreProducts } from "@/lib/catalog-queries";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) return {};
  return {
    title: { absolute: store.name },
    description: store.description,
    openGraph: {
      title: store.name,
      description: store.description,
      images: store.banner_url ? [store.banner_url] : []
    }
  };
}

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();

  const [categories, products] = await Promise.all([getStoreCategories(store.id), getStoreProducts(store.id)]);
  const featured = products.filter((product) => product.is_featured);

  return (
    <main className="overflow-hidden">
      <StoreHeader store={store} />
      <HeroSection store={store} featuredProducts={featured.length ? featured : products} />
      <CategoryShowcase categories={categories} products={products} />
      <CatalogClient store={store} categories={categories} products={products} />
      <KitsSection products={products} store={store} />
      <StoreFooter store={store} />
      <FloatingWhatsAppButton store={store} />
    </main>
  );
}
