import { FolderPlus } from "lucide-react";
import { CategoryForm } from "@/components/admin/category-form";
import { CategoryItem } from "@/components/admin/category-item";
import { getCurrentOwnerStore } from "@/lib/catalog-queries";

export default async function CategoriesPage() {
  const { categories, products } = await getCurrentOwnerStore();
  const counts = new Map<string, number>();
  products.forEach((product) => {
    if (product.category_id) counts.set(product.category_id, (counts.get(product.category_id) ?? 0) + 1);
  });

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-3xl font-semibold tracking-normal">Categorias</h2>
        <p className="mt-2 text-muted-foreground">Organize os produtos para facilitar a busca na loja.</p>
      </header>
      <CategoryForm />
      {categories.length ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => <CategoryItem count={counts.get(category.id) ?? 0} id={category.id} key={category.id} name={category.name} />)}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed bg-white px-6 py-14 text-center">
          <FolderPlus className="mx-auto size-8 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Crie sua primeira categoria</h3>
          <p className="mt-2 text-sm text-muted-foreground">Exemplos: Bolsas, Joias, Beleza ou Presentes.</p>
        </div>
      )}
    </div>
  );
}
