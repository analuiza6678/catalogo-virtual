import Link from "next/link";
import { FolderTree, Megaphone, Package, PackagePlus, Plus, Star, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/admin/stat-card";
import { getCurrentOwnerStore } from "@/lib/catalog-queries";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const { categories, products } = await getCurrentOwnerStore();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-semibold tracking-normal">Dashboard</h2>
          <p className="mt-2 text-muted-foreground">Visao rapida da vitrine e atalhos de gestao.</p>
        </div>
        <Button asChild>
          <Link href="/admin/produtos/novo">
            <Plus data-icon="inline-start" />
            Novo produto
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Produtos" value={products.length} icon={Package} />
        <StatCard title="Categorias" value={categories.length} icon={FolderTree} />
        <StatCard title="Destaques" value={products.filter((item) => item.is_featured).length} icon={Star} />
        <StatCard title="Promocoes" value={products.filter((item) => item.is_promotion).length} icon={Megaphone} />
        <StatCard title="Indisponiveis" value={products.filter((item) => !item.is_available).length} icon={XCircle} />
      </div>
      {products.length ? <Card className="rounded-lg bg-white">
        <CardHeader>
          <CardTitle>Produtos recentes</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b">
                <th className="py-3 font-medium">Produto</th>
                <th className="py-3 font-medium">Categoria</th>
                <th className="py-3 font-medium">Preco</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 6).map((product) => (
                <tr key={product.id} className="border-b last:border-0">
                  <td className="py-4 font-medium">{product.name}</td>
                  <td className="py-4 text-muted-foreground">{product.category?.name}</td>
                  <td className="py-4">{formatCurrency(product.price)}</td>
                  <td className="py-4">
                    <Badge variant={product.is_available ? "success" : "secondary"}>
                      {product.is_available ? "Disponivel" : "Indisponivel"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card> : (
        <div className="rounded-xl border border-dashed bg-white px-6 py-14 text-center">
          <PackagePlus className="mx-auto size-8 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Comece adicionando seu primeiro produto</h3>
          <p className="mt-2 text-sm text-muted-foreground">Depois ele aparecera automaticamente no catalogo publico.</p>
          <Button asChild className="mt-5"><Link href="/admin/produtos/novo">Adicionar produto</Link></Button>
        </div>
      )}
    </div>
  );
}
