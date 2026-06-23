import Image from "next/image";
import { ArrowRight, Gift, MessageCircle, Quote, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/public/product-card";
import type { ProductWithCategory, Store } from "@/types/catalog";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function NewArrivalsSection({ products, store }: { products: ProductWithCategory[]; store: Store }) {
  const items = products.filter((product) => product.is_new).slice(0, 4);
  if (!items.length) return null;
  return (
    <section id="novidades" className="relative bg-[#F8F1E8]/72 py-20">
      <div className="absolute inset-x-0 top-0 h-px gold-hairline" />
      <div className="container">
        <SectionTitle eyebrow="Novidades" title="Acabaram de chegar" text="Lancamentos delicados para renovar seu porta-joias, presentear ou completar o look." />
        <div className="mt-9 grid gap-6 md:grid-cols-4">
          {items.map((product) => <ProductCard key={product.id} product={product} store={store} />)}
        </div>
      </div>
    </section>
  );
}

export function KitsSection({ products, store }: { products: ProductWithCategory[]; store: Store }) {
  const kits = products.filter((product) => product.category?.slug === "kits").slice(0, 4);
  if (!kits.length) return null;
  return (
    <section id="kits" className="relative overflow-hidden bg-[#F3ECE4] py-24">
      <div className="absolute left-[-8rem] top-10 h-72 w-72 rounded-full bg-[#E4D1B7]/55 blur-3xl" />
      <div className="absolute right-[-6rem] bottom-10 h-72 w-72 rounded-full bg-[#C7A06A]/15 blur-3xl" />
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-[0.82fr_1.08fr]">
          <Reveal>
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#A8834A]">
              <Gift className="size-4" />
              Kits & Presentes
            </p>
            <h2 className="max-w-xl font-display text-5xl font-semibold leading-none text-[#171717] sm:text-6xl">
              Kits pensados para encantar em cada detalhe.
            </h2>
            <p className="mt-6 max-w-lg leading-8 text-[#6B7280]">
              Seleções delicadas para presentear com elegância ou montar combinações prontas com charme e praticidade.
            </p>
            <p className="mt-5 border-l border-[#C7A06A] pl-4 font-display text-2xl text-[#A8834A]">
              Escolhas especiais para momentos que merecem beleza.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="whatsapp">
                <a href={buildWhatsAppUrl(store, "Ola! Quero ajuda para escolher um kit Maison Catalogo.")} target="_blank" rel="noreferrer">
                  <MessageCircle data-icon="inline-start" />
                  Montar meu presente
                </a>
              </Button>
              <Button asChild variant="outline" className="border-[#171717]/25 bg-transparent">
                <a href="#produtos">
                  Ver todos os kits
                  <ArrowRight data-icon="inline-end" />
                </a>
              </Button>
            </div>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2">
            {kits.map((kit, index) => (
              <Reveal
                key={kit.id}
                delay={index * 0.08}
                className={`group overflow-hidden rounded-[1.7rem] border border-[#E4D1B7] bg-[#FFFAF6]/82 p-4 shadow-soft backdrop-blur transition hover:-translate-y-1 hover:shadow-premium ${
                  index === 0 ? "md:row-span-2" : ""
                }`}
              >
                <div className={`relative overflow-hidden rounded-[1.25rem] bg-[#F8F1E8] ${index === 0 ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
                  <Image src={kit.image_url} alt={kit.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/38 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-[#FFFAF6]/78 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#171717] backdrop-blur">
                    {index === 0 ? "Mais pedido" : "Combo especial"}
                  </span>
                </div>
                <div className="p-2 pt-4">
                  <h3 className="font-display text-3xl font-semibold text-[#171717]">{kit.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6B7280]">{kit.short_description}</p>
                  <a
                    href={buildWhatsAppUrl(store, kit.whatsapp_message ?? `Ola! Tenho interesse no ${kit.name}. Pode me passar mais detalhes?`)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#16A34A] transition group-hover:translate-x-1"
                  >
                    Tenho interesse
                    <ArrowRight className="size-4" />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const testimonials = [
    "Atendimento impecavel e pecas lindas. A embalagem veio perfeita.",
    "Chegou muito rapido e o acabamento dos acessorios e maravilhoso.",
    "A loja foi super atenciosa e me ajudou a montar um presente delicado."
  ];
  return (
    <section className="bg-[#F8F1E8]/72 py-20">
      <div className="container">
        <SectionTitle eyebrow="Clientes" title="Carinho em cada detalhe" text="Prova social discreta para transmitir confianca antes da conversa no WhatsApp." />
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {testimonials.map((text) => (
            <Reveal key={text} className="rounded-[1.5rem] border border-[#E7D3B5] bg-[#FFFAF6]/86 p-6 shadow-sm">
              <Quote className="text-[#C7A06A]" />
              <p className="mt-5 leading-7 text-[#1F2937]">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InstagramSection() {
  const images = [
    "/images/maison-model-case.jpg",
    "/images/maison-jewelry-closeup.jpg",
    "/images/maison-hands-jewelry.jpg",
    "/images/maison-model-hero.jpg"
  ];
  return (
    <section className="py-20">
      <div className="container">
        <SectionTitle eyebrow="Inspiracoes" title="Composicoes para salvar" text="Um respiro visual com ideias de uso, presentes e combinacoes delicadas." />
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image) => (
            <div key={image} className="relative aspect-square overflow-hidden rounded-[1.5rem] border border-[#E7D3B5] bg-[#F8F1E8] shadow-sm">
              <Image src={image} alt="Inspiracao Maison Catalogo" fill className="object-cover transition duration-700 hover:scale-105" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  const questions = [
    ["Como comprar?", "Escolha o produto e clique em Tenho interesse. O WhatsApp abre com a mensagem pronta."],
    ["Tem entrega?", "Sim. A entrega e combinada diretamente no atendimento, conforme sua cidade e urgencia."],
    ["Posso montar um presente?", "Pode sim. A loja ajuda a combinar pecas, embalagem e cartao."],
    ["Os produtos sao pronta entrega?", "A maioria sim. Itens indisponiveis aparecem sinalizados no catalogo."],
    ["Como funciona a reserva?", "A reserva e feita no WhatsApp apos confirmacao de disponibilidade."]
  ];
  return (
    <section className="bg-[#F8F1E8]/72 py-20">
      <div className="container max-w-4xl">
        <SectionTitle eyebrow="Duvidas" title="Compra simples, conversa humana" text="Tudo pensado para reduzir atrito e levar a cliente ao atendimento certo." />
        <div className="mt-9 grid gap-3">
          {questions.map(([question, answer]) => (
            <details key={question} className="group rounded-[1.2rem] border border-[#E7D3B5] bg-[#FFFAF6]/88 p-5 shadow-sm">
              <summary className="cursor-pointer list-none font-semibold text-[#1F2937]">{question}</summary>
              <p className="mt-3 leading-7 text-[#6B7280]">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <Reveal>
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#A8834A]">
        <Sparkles className="size-4" />
        {eyebrow}
      </p>
      <h2 className="font-display text-4xl font-semibold tracking-normal sm:text-5xl">{title}</h2>
      <p className="mt-3 max-w-2xl leading-7 text-[#6B7280]">{text}</p>
    </Reveal>
  );
}
