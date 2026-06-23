"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function ProductGallery({ name, images }: { name: string; images: string[] }) {
  const uniqueImages = Array.from(new Set(images.filter(Boolean)));
  const [active, setActive] = useState(uniqueImages[0]);

  return (
    <div className="flex flex-col gap-4">
      <motion.div layout className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-[#ead8bc] bg-secondary shadow-premium">
        <Image src={active} alt={name} fill priority className="object-cover" />
      </motion.div>
      {uniqueImages.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {uniqueImages.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(image)}
              className="relative aspect-square overflow-hidden rounded-2xl border border-[#ead8bc] bg-secondary transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[active=true]:ring-2 data-[active=true]:ring-[#c9a66b]"
              data-active={active === image}
              aria-label={`Ver imagem de ${name}`}
            >
              <Image src={image} alt={name} fill className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
