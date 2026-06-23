import { ProductForm } from "@/components/admin/product-form";
import { getCurrentOwnerStore } from "@/lib/catalog-queries";

export default async function NewProductPage() {
  const { categories } = await getCurrentOwnerStore();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-normal">Novo produto</h2>
        <p className="mt-2 text-muted-foreground">Preencha os detalhes que serao exibidos no catalogo.</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
