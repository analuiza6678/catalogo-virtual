import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getCurrentOwnerStore } from "@/lib/catalog-queries";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { categories, products } = await getCurrentOwnerStore();
  const product = products.find((item) => item.id === id);
  if (!product) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-normal">Editar produto</h2>
        <p className="mt-2 text-muted-foreground">Atualize informacoes, status e imagens do produto.</p>
      </div>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
