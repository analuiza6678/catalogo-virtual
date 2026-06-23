import Link from "next/link";
import { ExternalLink, LogOut, Menu } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import type { Store } from "@/types/catalog";

export function AdminHeader({ store }: { store: Store }) {
  return (
    <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-8">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="lg:hidden" aria-label="Abrir menu">
            <Menu />
          </Button>
          <div>
            <p className="text-sm text-muted-foreground">Painel administrativo</p>
            <h1 className="font-semibold">{store.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/loja/${store.slug}`} target="_blank">
              <ExternalLink data-icon="inline-start" />
              Ver loja
            </Link>
          </Button>
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="icon" aria-label="Sair">
              <LogOut />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
