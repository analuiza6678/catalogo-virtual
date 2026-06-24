import Link from "next/link";
import { FolderPlus } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { getCurrentOwnerStore } from "@/lib/catalog-queries";

export default async function NewProductPage() {
  const { categories } = await getCurrentOwnerStore();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-normal">Novo produto</h2>
        <p className="mt-2 text-muted-foreground">Preencha os detalhes que serao exibidos no catalogo.</p>
      </div>
      {categories.length ? <ProductForm categories={categories} /> : (
        <div className="rounded-xl border border-dashed bg-white px-6 py-14 text-center">
          <FolderPlus className="mx-auto size-8 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Crie uma categoria primeiro</h3>
          <p className="mt-2 text-sm text-muted-foreground">Todo produto precisa estar organizado em uma categoria.</p>
          <Button asChild className="mt-5"><Link href="/admin/categorias">Ir para categorias</Link></Button>
        </div>
      )}
    </div>
  );
}
