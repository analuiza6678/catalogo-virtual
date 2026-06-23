"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Store } from "@/types/catalog";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function FloatingWhatsAppButton({ store }: { store: Store }) {
  return (
    <motion.a
      href={buildWhatsAppUrl(store, `Ola! Vim pelo catalogo da ${store.name} e gostaria de atendimento.`)}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex size-14 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-premium ring-8 ring-[#fffaf3]/80 transition hover:-translate-y-1 hover:bg-[#128c3f]"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [1, 1.05, 1], opacity: 1 }}
      transition={{ delay: 0.8, duration: 2.4, repeat: Infinity, repeatDelay: 2.6, ease: "easeInOut" }}
      whileTap={{ scale: 0.94 }}
    >
      <span className="absolute inset-0 rounded-full bg-[#16a34a] opacity-25 blur-md" />
      <MessageCircle className="relative" />
    </motion.a>
  );
}
