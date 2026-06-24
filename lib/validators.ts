import { z } from "zod";

function isAllowedImageUrl(value: string) {
  if (value.startsWith("/images/")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

const imageUrlSchema = z.string().refine(isAllowedImageUrl, "Use uma imagem enviada ao Supabase.");

export const loginSchema = z.object({
  email: z.string().email("Informe um e-mail valido."),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres.")
});

export const signupSchema = loginSchema.extend({
  confirmPassword: z.string().min(8, "Confirme a senha.")
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas nao coincidem.",
  path: ["confirmPassword"]
});

export const emailSchema = z.object({
  email: z.string().trim().email("Informe um e-mail valido.")
});

export const passwordResetSchema = z.object({
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
  confirmPassword: z.string().min(8, "Confirme a senha.")
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas nao coincidem.",
  path: ["confirmPassword"]
});

const optionalNumber = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? null : value),
  z.coerce.number().finite().nonnegative().nullable()
);

const formBoolean = z.preprocess(
  (value) => value === true || value === "true" || value === "on" || value === "1",
  z.boolean()
);

export const productSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do produto.").max(120, "Use no maximo 120 caracteres."),
  short_description: z.string().trim().min(8, "Escreva uma descricao curta.").max(220, "Use no maximo 220 caracteres."),
  description: z.string().trim().min(16, "Escreva uma descricao completa.").max(5000, "A descricao esta muito longa."),
  price: z.coerce.number().finite().positive("Informe um preco valido."),
  compare_price: optionalNumber,
  category_id: z.string().min(1, "Selecione uma categoria."),
  sku: z.string().optional().nullable(),
  image_url: imageUrlSchema,
  gallery_urls: z.string().optional().refine(
    (value) => !value || value.split(",").map((url) => url.trim()).filter(Boolean).every(isAllowedImageUrl),
    "Envie as imagens da galeria pelo Supabase."
  ),
  is_available: formBoolean.default(true),
  is_featured: formBoolean.default(false),
  is_promotion: formBoolean.default(false),
  is_new: formBoolean.default(false),
  material: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  stock: z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? null : value),
    z.coerce.number().int().nonnegative().nullable()
  ),
  whatsapp_message: z.string().optional().nullable(),
  tags: z.string().optional()
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Informe o nome da categoria.").max(80, "Use no maximo 80 caracteres.")
});

export const storeSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome da loja.").max(100),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minusculas, numeros e hifens."),
  logo_url: imageUrlSchema.optional().or(z.literal("")),
  banner_url: imageUrlSchema.optional().or(z.literal("")),
  description: z.string().trim().min(12, "Descreva sua loja.").max(1000),
  whatsapp_number: z.string().refine((value) => value.replace(/\D/g, "").length >= 10, "Informe o WhatsApp com DDD."),
  whatsapp_default_message: z.string().optional(),
  primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Informe uma cor valida."),
  address: z.string().optional(),
  business_hours: z.string().optional(),
  instagram_url: z.string().url().optional().or(z.literal(""))
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.input<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type StoreInput = z.infer<typeof storeSchema>;
