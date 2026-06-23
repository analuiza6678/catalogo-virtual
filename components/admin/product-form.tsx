"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type Control } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { upsertProductAction } from "@/app/actions/catalog";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { productSchema, type ProductInput } from "@/lib/validators";
import type { Category, ProductWithCategory } from "@/types/catalog";

export function ProductForm({ categories, product }: { categories: Category[]; product?: ProductWithCategory }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      short_description: product?.short_description ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      compare_price: product?.compare_price ?? null,
      category_id: product?.category_id ?? categories[0]?.id ?? "",
      sku: product?.sku ?? "",
      image_url: product?.image_url ?? "",
      gallery_urls: product?.gallery_urls?.join(", ") ?? "",
      is_available: product?.is_available ?? true,
      is_featured: product?.is_featured ?? false,
      is_promotion: product?.is_promotion ?? false,
      is_new: product?.is_new ?? false,
      material: product?.material ?? "",
      color: product?.color ?? "",
      size: product?.size ?? "",
      notes: product?.notes ?? "",
      stock: product?.stock ?? null,
      whatsapp_message: product?.whatsapp_message ?? "",
      tags: product?.tags?.join(", ") ?? ""
    }
  });

  function submit(values: ProductInput) {
    const formData = new FormData();
    if (product?.id) formData.set("id", product.id);
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.set(key, String(value));
    });
    startTransition(async () => {
      const result = await upsertProductAction(formData);
      if (result.ok) {
        toast.success(result.message);
        router.push("/admin/produtos");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-5 rounded-lg border bg-white p-6 shadow-sm">
        <Field label="Nome do produto" error={form.formState.errors.name?.message}>
          <Input {...form.register("name")} placeholder="Ex: Bolsa Aurora Couro" />
        </Field>
        <Field label="Descricao curta" error={form.formState.errors.short_description?.message}>
          <Input {...form.register("short_description")} placeholder="Resumo para o card do catalogo" />
        </Field>
        <Field label="Descricao completa" error={form.formState.errors.description?.message}>
          <Textarea {...form.register("description")} placeholder="Detalhes, materiais, medidas e diferenciais" />
        </Field>
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Preco" error={form.formState.errors.price?.message}>
            <Input type="number" step="0.01" {...form.register("price")} />
          </Field>
          <Field label="Preco comparativo" error={form.formState.errors.compare_price?.message}>
            <Input type="number" step="0.01" {...form.register("compare_price")} />
          </Field>
          <Field label="SKU" error={form.formState.errors.sku?.message}>
            <Input {...form.register("sku")} placeholder="Opcional" />
          </Field>
        </div>
        <div className="grid gap-5 md:grid-cols-4">
          <Field label="Material" error={form.formState.errors.material?.message}>
            <Input {...form.register("material")} placeholder="Banho dourado, couro..." />
          </Field>
          <Field label="Cor" error={form.formState.errors.color?.message}>
            <Input {...form.register("color")} placeholder="Champagne, nude..." />
          </Field>
          <Field label="Tamanho" error={form.formState.errors.size?.message}>
            <Input {...form.register("size")} placeholder="Unico, ajustavel..." />
          </Field>
          <Field label="Estoque" error={form.formState.errors.stock?.message}>
            <Input type="number" min="0" {...form.register("stock")} placeholder="0" />
          </Field>
        </div>
        <Field label="Tags" error={form.formState.errors.tags?.message}>
          <Input {...form.register("tags")} placeholder="kit, presente, dourado" />
        </Field>
        <Field label="Observacoes" error={form.formState.errors.notes?.message}>
          <Textarea {...form.register("notes")} placeholder="Cuidados, embalagem, prazo ou detalhes extras" />
        </Field>
        <Field label="Categoria" error={form.formState.errors.category_id?.message}>
          <Controller
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>
      <aside className="flex flex-col gap-5 rounded-lg border bg-white p-6 shadow-sm">
        <Field label="Imagem principal" error={form.formState.errors.image_url?.message}>
          <Controller
            control={form.control}
            name="image_url"
            render={({ field }) => <ImageUploadField value={field.value} onChange={field.onChange} />}
          />
        </Field>
        <Field label="Galeria de imagens" error={form.formState.errors.gallery_urls?.message}>
          <Textarea {...form.register("gallery_urls")} placeholder="URLs separadas por virgula" />
        </Field>
        <Field label="Mensagem personalizada do WhatsApp" error={form.formState.errors.whatsapp_message?.message}>
          <Textarea {...form.register("whatsapp_message")} placeholder="Opcional. Use uma mensagem especifica para kits ou promocoes." />
        </Field>
        <Toggle label="Disponivel" control={form.control} name="is_available" />
        <Toggle label="Produto em destaque" control={form.control} name="is_featured" />
        <Toggle label="Marcar como promocao" control={form.control} name="is_promotion" />
        <Toggle label="Marcar como novidade" control={form.control} name="is_new" />
        <div className="mt-auto flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <Save data-icon="inline-start" />}
            Salvar
          </Button>
        </div>
      </aside>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2" data-invalid={Boolean(error)}>
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

function Toggle({ label, control, name }: { label: string; control: Control<ProductInput>; name: "is_available" | "is_featured" | "is_promotion" | "is_new" }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <label className="flex items-center justify-between rounded-lg border p-4 text-sm font-medium">
          {label}
          <Switch checked={Boolean(field.value)} onCheckedChange={field.onChange} />
        </label>
      )}
    />
  );
}
