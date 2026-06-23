"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { categorySchema, productSchema, storeSchema } from "@/lib/validators";

async function requireUserStore() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { supabase: null, store: null, error: "Supabase nao configurado." };

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { supabase: null, store: null, error: "Sessao expirada. Entre novamente." };

  const { data: store } = await supabase.from("stores").select("*").eq("owner_id", user.id).single();
  if (!store) return { supabase: null, store: null, error: "A loja do proprietario nao foi encontrada." };
  return { supabase, store, error: null };
}

export async function upsertProductAction(formData: FormData) {
  const parsed = productSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: parsed.error.errors[0]?.message ?? "Dados invalidos." };

  const { supabase, store, error } = await requireUserStore();
  if (!supabase || !store) return { ok: false, message: error ?? "Acesso negado." };

  const id = formData.get("id")?.toString();
  const payload = {
    ...parsed.data,
    store_id: store.id,
    slug: slugify(parsed.data.name),
    gallery_urls: parsed.data.gallery_urls
      ? parsed.data.gallery_urls.split(",").map((url) => url.trim()).filter(Boolean)
      : [],
    tags: parsed.data.tags
      ? parsed.data.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : []
  };

  const result = id
    ? await supabase.from("products").update(payload).eq("id", id).eq("store_id", store.id)
    : await supabase.from("products").insert(payload);

  if (result.error) return { ok: false, message: result.error.message };
  revalidatePath("/admin/produtos");
  revalidatePath(`/loja/${store.slug}`);
  return { ok: true, message: "Produto salvo com sucesso." };
}

export async function deleteProductAction(productId: string) {
  const { supabase, store, error: authError } = await requireUserStore();
  if (!supabase || !store) return { ok: false, message: authError ?? "Acesso negado." };

  const { error } = await supabase.from("products").delete().eq("id", productId).eq("store_id", store.id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/produtos");
  return { ok: true, message: "Produto excluido." };
}

export async function upsertCategoryAction(formData: FormData) {
  const parsed = categorySchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: parsed.error.errors[0]?.message ?? "Dados invalidos." };

  const { supabase, store, error } = await requireUserStore();
  if (!supabase || !store) return { ok: false, message: error ?? "Acesso negado." };

  const id = formData.get("id")?.toString();
  const payload = { ...parsed.data, store_id: store.id, slug: slugify(parsed.data.name) };
  const result = id
    ? await supabase.from("categories").update(payload).eq("id", id).eq("store_id", store.id)
    : await supabase.from("categories").insert(payload);

  if (result.error) return { ok: false, message: result.error.message };
  revalidatePath("/admin/categorias");
  return { ok: true, message: "Categoria salva." };
}

export async function updateStoreAction(formData: FormData) {
  const parsed = storeSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: parsed.error.errors[0]?.message ?? "Dados invalidos." };

  const { supabase, store, error: authError } = await requireUserStore();
  if (!supabase || !store) return { ok: false, message: authError ?? "Acesso negado." };

  const { error } = await supabase.from("stores").update(parsed.data).eq("id", store.id).eq("owner_id", store.owner_id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/configuracoes");
  revalidatePath(`/loja/${parsed.data.slug}`);
  return { ok: true, message: "Loja atualizada." };
}
