"use client";

import { useEffect, useMemo, useState, useTransition, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, MessageCircle, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "@/components/public/product-card";
import { ProductDetailModal } from "@/components/public/product-detail-modal";
import type { Category, ProductWithCategory, Store } from "@/types/catalog";

type SortKey = "recentes" | "nome" | "menor-preco" | "maior-preco" | "promocoes" | "destaques";

export function CatalogClient({
  store,
  categories,
  products,
  initialCategory
}: {
  store: Store;
  categories: Category[];
  products: ProductWithCategory[];
  initialCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory ?? "todas");
  const [sort, setSort] = useState<SortKey>("recentes");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyPromotion, setOnlyPromotion] = useState(false);
  const [onlyNew, setOnlyNew] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithCategory | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    function handleCategory(event: Event) {
      const detail = (event as CustomEvent<string>).detail;
      startTransition(() => {
        setCategory(detail);
        setVisibleCount(9);
      });
    }

    window.addEventListener("catalog:set-category", handleCategory);
    return () => window.removeEventListener("catalog:set-category", handleCategory);
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const max = Number(maxPrice);
    return products
      .filter((product) => category === "todas" || product.category?.slug === category)
      .filter((product) => !normalized || product.name.toLowerCase().includes(normalized))
      .filter((product) => !maxPrice || product.price <= max)
      .filter((product) => !onlyPromotion || product.is_promotion)
      .filter((product) => !onlyNew || product.is_new)
      .sort((a, b) => {
        if (sort === "nome") return a.name.localeCompare(b.name);
        if (sort === "menor-preco") return a.price - b.price;
        if (sort === "maior-preco") return b.price - a.price;
        if (sort === "promocoes") return Number(b.is_promotion) - Number(a.is_promotion);
        if (sort === "destaques") return Number(b.is_featured) - Number(a.is_featured);
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [category, maxPrice, onlyNew, onlyPromotion, products, query, sort]);

  const visibleProducts = filtered.slice(0, visibleCount);
  const related = selectedProduct
    ? products.filter((item) => item.id !== selectedProduct.id && item.category_id === selectedProduct.category_id)
    : [];

  function clearFilters() {
    setQuery("");
    setCategory("todas");
    setSort("recentes");
    setMaxPrice("");
    setOnlyPromotion(false);
    setOnlyNew(false);
    setVisibleCount(9);
  }

  return (
    <section id="produtos" className="relative bg-[#FAF7F2] py-20">
      <div className="absolute inset-x-0 top-0 h-px gold-hairline" />
      <div className="container flex flex-col gap-9">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#A8834A]">
            <Sparkles className="size-4" />
            ESCOLHA COM CALMA
          </p>
          <h2 className="font-display text-4xl font-semibold tracking-normal text-[#171717] sm:text-6xl">Catálogo completo</h2>
          <p className="mt-3 max-w-2xl leading-7 text-[#6B7280]">
            Explore peças selecionadas para compor looks elegantes, delicados e cheios de personalidade.
          </p>
        </div>
        <p className="rounded-full border border-[#E4D1B7] bg-[#FFFAF6]/78 px-5 py-2 text-sm font-semibold text-[#374151] shadow-sm">
          {filtered.length} peças disponíveis
        </p>
      </div>

      <CatalogHighlights />

      <div className="grid gap-4 rounded-[1.8rem] border border-[#E4D1B7] bg-[#FFFAF6]/72 p-4 shadow-soft backdrop-blur-xl lg:grid-cols-[1fr_190px_180px_180px]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A8834A]" />
          <Input
            value={query}
            onChange={(event) => startTransition(() => setQuery(event.target.value))}
            placeholder="Buscar por nome do produto"
            className="pl-11"
          />
        </label>
        <Select value={category} onValueChange={(value) => startTransition(() => setCategory(value))}>
          <SelectTrigger aria-label="Filtrar categoria">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="todas">Todas categorias</SelectItem>
              {categories.map((item) => (
                <SelectItem key={item.id} value={item.slug}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          type="number"
          min="0"
          value={maxPrice}
          onChange={(event) => startTransition(() => setMaxPrice(event.target.value))}
          placeholder="Preco maximo"
        />
        <Select value={sort} onValueChange={(value) => startTransition(() => setSort(value as SortKey))}>
          <SelectTrigger aria-label="Ordenar produtos">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="recentes">Mais recentes</SelectItem>
              <SelectItem value="nome">Nome</SelectItem>
              <SelectItem value="menor-preco">Menor preco</SelectItem>
              <SelectItem value="maior-preco">Maior preco</SelectItem>
              <SelectItem value="promocoes">Promocoes</SelectItem>
              <SelectItem value="destaques">Destaques</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex gap-2 overflow-x-auto pb-1 lg:col-span-4">
          <FilterChip active={category === "todas"} onClick={() => setCategory("todas")}>Todas</FilterChip>
          {categories.map((item) => (
            <FilterChip key={item.id} active={category === item.slug} onClick={() => setCategory(item.slug)}>
              {item.name}
            </FilterChip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:col-span-4">
          <FilterButton active={onlyPromotion} onClick={() => setOnlyPromotion((value) => !value)}>Promocoes</FilterButton>
          <FilterButton active={onlyNew} onClick={() => setOnlyNew((value) => !value)}>Novidades</FilterButton>
          <Button type="button" variant="outline" size="sm" onClick={clearFilters}>Limpar filtros</Button>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.length ? (
          <motion.div layout className="grid gap-7 sm:grid-cols-2 lg:auto-rows-auto lg:grid-cols-3">
            {visibleProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                store={store}
                onQuickView={setSelectedProduct}
                featuredLayout={index === 0}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-72 flex-col items-center justify-center rounded-[1.5rem] border border-[#ead8bc] bg-[#fffaf3]/70 p-8 text-center shadow-soft"
          >
            <SlidersHorizontal className="text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">Nenhum produto encontrado</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Ajuste a busca ou escolha outra categoria para continuar explorando.
            </p>
            <Button className="mt-5" variant="outline" onClick={() => { setQuery(""); setCategory("todas"); }}>
              Limpar filtros
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      {filtered.length > visibleProducts.length ? (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setVisibleCount((count) => count + 6)}>
            Ver mais produtos
          </Button>
        </div>
      ) : null}
      {selectedProduct ? (
        <ProductDetailModal product={selectedProduct} store={store} related={related} onClose={() => setSelectedProduct(null)} />
      ) : null}
      {isPending ? <span className="sr-only">Atualizando produtos</span> : null}
      </div>
    </section>
  );
}

function CatalogHighlights() {
  const items = [
    ["Peças selecionadas", "Curadoria feita para looks elegantes", Sparkles],
    ["Compra pelo WhatsApp", "Atendimento rápido e personalizado", MessageCircle],
    ["Presentes especiais", "Kits prontos para surpreender", Gift]
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map(([title, text, Icon]) => (
        <div key={title as string} className="rounded-[1.35rem] border border-[#E4D1B7] bg-[#FFFAF6]/70 p-4 shadow-sm">
          <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-[#F3ECE4] text-[#A8834A]">
            <Icon />
          </span>
          <p className="font-semibold text-[#171717]">{title as string}</p>
          <p className="mt-1 text-sm leading-6 text-[#6B7280]">{text as string}</p>
        </div>
      ))}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-[#E4D1B7] px-4 py-2 text-sm font-semibold text-[#1F2937] transition hover:-translate-y-0.5 data-[active=true]:bg-[#1F2937] data-[active=true]:text-white"
      data-active={active}
    >
      {children}
    </button>
  );
}

function FilterChip({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-full border border-[#E4D1B7] px-4 py-2 text-sm font-semibold text-[#374151] transition data-[active=true]:border-[#171717] data-[active=true]:bg-[#171717] data-[active=true]:text-white"
      data-active={active}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}
