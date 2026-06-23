import { FolderTree } from "lucide-react";
import { CategoryForm } from "@/components/admin/category-form";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentOwnerStore } from "@/lib/catalog-queries";

export default async function CategoriesPage() {
  const { categories, products } = await getCurrentOwnerStore();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-normal">Categorias</h2>
        <p className="mt-2 text-muted-foreground">Organize filtros para facilitar a navegacao do cliente.</p>
      </div>
      <CategoryForm />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="rounded-lg bg-white">
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-primary">
                  <FolderTree />
                </span>
                <div>
                  <p className="font-semibold">{category.name}</p>
                  <p className="text-sm text-muted-foreground">{products.filter((product) => product.category_id === category.id).length} produto(s)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
