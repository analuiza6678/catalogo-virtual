import Link from "next/link";
import { BarChart3, FolderTree, Package, Settings, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: FolderTree },
  { href: "/admin/configuracoes", label: "Configuracoes", icon: Settings }
];

export function AdminSidebar() {
  return (
    <aside className="hidden min-h-screen w-72 border-r bg-white/80 p-5 backdrop-blur-xl lg:block">
      <Link href="/admin/dashboard" className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-lg bg-foreground text-background">
          <Sparkles />
        </span>
        <span>
          <span className="block font-semibold">Catalogo Pro</span>
          <span className="text-xs text-muted-foreground">Painel da loja</span>
        </span>
      </Link>
      <Separator className="my-6" />
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <item.icon />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
