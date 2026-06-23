import Image from "next/image";
import Link from "next/link";
import { Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { getCurrentOwnerStore } from "@/lib/catalog-queries";
import { formatCurrency } from "@/lib/utils";

export default async function ProductsPage() {
  const { products } = await getCurrentOwnerStore();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-semibold tracking-normal">Produtos</h2>
          <p className="mt-2 text-muted-foreground">Cadastre, edite e destaque itens da vitrine.</p>
        </div>
        <Button asChild>
          <Link href="/admin/produtos/novo"><Plus data-icon="inline-start" />Novo produto</Link>
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-secondary/70 text-left text-muted-foreground">
              <tr>
                <th className="px-5 py-4 font-medium">Produto</th>
                <th className="px-5 py-4 font-medium">Categoria</th>
                <th className="px-5 py-4 font-medium">Preco</th>
                <th className="px-5 py-4 font-medium">Marcadores</th>
                <th className="px-5 py-4 text-right font-medium">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative size-14 overflow-hidden rounded-lg bg-secondary">
                        <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{product.category?.name}</td>
                  <td className="px-5 py-4">{formatCurrency(product.price)}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {product.is_featured ? <Badge variant="success">Destaque</Badge> : null}
                      {product.is_promotion ? <Badge variant="promotion">Promocao</Badge> : null}
                      {!product.is_available ? <Badge variant="secondary">Indisponivel</Badge> : null}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="icon">
                        <Link href={`/admin/produtos/${product.id}/editar`} aria-label="Editar produto"><Edit /></Link>
                      </Button>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
