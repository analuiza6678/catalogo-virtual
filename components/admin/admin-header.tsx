"use client";

import Link from "next/link";
const pathname = usePathname() ?? ""import { BarChart3, ExternalLink, FolderTree, LogOut, Package, Settings } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import type { Store } from "@/types/catalog";

const items = [
  { href: "/admin/dashboard", label: "Inicio", icon: BarChart3 },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: FolderTree },
  { href: "/admin/configuracoes", label: "Configuracoes", icon: Settings }
];

export function AdminHeader({ store, userEmail }: { store: Store; userEmail: string }) {
const pathname = usePathname() ?? "";
  return (
    <header className="sticky top-0 z-30 border-b border-black/[0.07] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-4 py-3">
          <Link className="flex min-w-0 items-center gap-3" href="/admin/dashboard">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#31523f] text-[0.68rem] font-black tracking-[0.14em] text-white">MC</span>
            <span className="min-w-0">
              <span className="block truncate font-display text-xl font-semibold leading-none">{store.name}</span>
              <span className="mt-1 block truncate text-xs text-muted-foreground">{userEmail}</span>
            </span>
          </Link>

          <div className="flex items-center gap-1.5">
            <Button asChild variant="outline" size="sm">
              <Link href={`/loja/${store.slug}`} target="_blank"><ExternalLink data-icon="inline-start" /><span className="hidden sm:inline">Ver loja</span></Link>
            </Button>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" size="icon" aria-label="Sair do painel"><LogOut /></Button>
            </form>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto pb-3" aria-label="Navegacao administrativa">
          {items.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${active ? "bg-[#31523f] text-white" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
                href={item.href}
                key={item.href}
              >
                <item.icon className="size-4" />{item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

