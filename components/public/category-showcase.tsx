"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { Category, ProductWithCategory } from "@/types/catalog";

const categoryData: Record<string, { image: string; description: string; tag?: string; featured?: boolean }> = {
  bolsas: {
    image: "/images/maison-model-case.jpg",
    description: "Peças estruturadas e sofisticadas",
    tag: "Mais desejadas",
    featured: true
  },
  colares: {
    image: "/images/maison-jewelry-closeup.jpg",
    description: "Detalhes que iluminam a composição",
    featured: true
  },
  brincos: {
    image: "/images/maison-model-hero.jpg",
    description: "Leveza e destaque em cada look"
  },
  pulseiras: {
    image: "/images/maison-hands-jewelry.jpg",
    description: "Delicadeza para todas as ocasiões"
  },
  aneis: {
    image: "/images/maison-jewelry-closeup.jpg",
    description: "Toque final com personalidade"
  },
  oculos: {
    image: "/images/maison-model-hero.jpg",
    description: "Estilo e presença"
  },
  relogios: {
    image: "/images/maison-hands-jewelry.jpg",
    description: "Elegância funcional"
  },
  kits: {
    image: "/images/maison-model-case.jpg",
    description: "Combinações prontas para presentear",
    tag: "Curadoria Lumi"
  },
  presentes: {
    image: "/images/maison-model-case.jpg",
    description: "Escolhas delicadas para surpreender"
  }
};

export function CategoryShowcase({
  categories,
  products
}: {
  categories: Category[];
  products: ProductWithCategory[];
}) {
  function chooseCategory(slug: string) {
    window.dispatchEvent(new CustomEvent("catalog:set-category", { detail: slug }));
    document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section id="categorias" className="relative overflow-hidden bg-[#FAF7F2] py-20">
      <div className="absolute inset-x-0 top-0 h-px gold-hairline" />
      <div className="absolute right-[-8rem] top-20 h-64 w-64 rounded-full bg-[#E4D1B7]/35 blur-3xl" />
      <div className="container">
        <SectionHeader />
        <motion.div
          className="mt-10 grid auto-rows-[220px] gap-5 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        >
          {categories.slice(0, 8).map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              count={products.filter((product) => product.category_id === category.id).length}
              onClick={() => chooseCategory(category.slug)}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SectionHeader() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr] lg:items-end">
      <div>
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#A8834A]">
          <Sparkles className="size-4" />
          Categorias
        </p>
        <h2 className="max-w-3xl font-display text-4xl font-semibold leading-none text-[#171717] sm:text-6xl">
          Uma curadoria para cada estilo e ocasião.
        </h2>
      </div>
      <p className="max-w-xl leading-8 text-[#6B7280]">
        Bolsas, joias e acessórios selecionados para acompanhar sua rotina com elegância, leveza e personalidade.
      </p>
    </div>
  );
}

function CategoryCard({
  category,
  count,
  onClick,
  index
}: {
  category: Category;
  count: number;
  onClick: () => void;
  index: number;
}) {
  const data = categoryData[category.slug] ?? categoryData.presentes;
  const isLarge = data.featured && index < 2;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[1.8rem] border border-[#E4D1B7] bg-[#FFFAF6] text-left shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-[#C7A06A] ${
        isLarge ? "sm:col-span-2 sm:row-span-2" : ""
      }`}
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.98 },
        show: { opacity: 1, y: 0, scale: 1 }
      }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
    >
      <Image src={data.image} alt={category.name} fill className="object-cover transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/72 via-[#171717]/20 to-transparent" />
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#C7A06A]/20 to-transparent" />
      </div>
      {data.tag ? (
        <span className="absolute left-5 top-5 rounded-full border border-white/35 bg-[#FFFAF6]/72 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#171717] backdrop-blur">
          {data.tag}
        </span>
      ) : null}
      <div className="absolute inset-x-5 bottom-5">
        <div className="mb-4 h-px w-20 bg-[#E4D1B7]/70" />
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-3xl font-semibold leading-none text-white sm:text-4xl">{category.name}</p>
            <p className="mt-2 max-w-[18rem] text-sm leading-6 text-white/82">{data.description}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/65">{count} itens</p>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/35 bg-white/12 text-white backdrop-blur transition group-hover:-translate-y-1 group-hover:translate-x-1">
            <ArrowUpRight />
          </span>
        </div>
      </div>
    </motion.button>
  );
}
