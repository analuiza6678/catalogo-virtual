"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ImageUploadField({
  value,
  onChange,
  placeholder = "https://..."
}: {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function upload(file: File) {
    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!allowedTypes.has(file.type)) {
      toast.error("Use uma imagem JPG, PNG ou WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no maximo 5 MB.");
      return;
    }

    setIsUploading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sua sessao expirou. Entre novamente.");
      const extensionByType: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp"
      };
      const path = `${user.id}/products/${crypto.randomUUID()}.${extensionByType[file.type]}`;
      const { error } = await supabase.storage.from("catalog-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false
      });
      if (error) throw error;
      const { data } = supabase.storage.from("catalog-images").getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Imagem enviada com sucesso.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Nao foi possivel enviar a imagem.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {value ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-secondary">
          <Image src={value} alt="Previa da imagem" fill className="object-cover" />
        </div>
      ) : null}
      <Input value={value ?? ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />
      <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={isUploading}>
        {isUploading ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <ImagePlus data-icon="inline-start" />}
        Enviar imagem
      </Button>
    </div>
  );
}
