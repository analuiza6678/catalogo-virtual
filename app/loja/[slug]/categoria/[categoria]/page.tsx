import { notFound } from "next/navigation";
import { CatalogClient } from "@/components/public/catalog-client";
import { FloatingWhatsAppButton } from "@/components/public/floating-whatsapp-button";
import { StoreFooter } from "@/components/public/store-footer";
import { StoreHeader } from "@/components/public/store-header";
import { getStoreBySlug, getStoreCategories, getStoreProducts } from "@/lib/catalog-queries";

export default async function CategoryPage({
  params
}: {
  params: Promise<{ slug: string; categoria: string }>;
}) {
  const { slug, categoria } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();
  const [categories, products] = await Promise.all([getStoreCategories(store.id), getStoreProducts(store.id)]);

  return (
    <main>
      <StoreHeader store={store} />
      <section className="bg-secondary/60 py-16">
        <div className="container">
          <h1 className="text-4xl font-semibold">Categoria</h1>
          <p className="mt-2 text-muted-foreground">Produtos filtrados para uma compra mais rapida.</p>
        </div>
      </section>
      <CatalogClient store={store} categories={categories} products={products} initialCategory={categoria} />
      <StoreFooter store={store} />
      <FloatingWhatsAppButton store={store} />
    </main>
  );
}
