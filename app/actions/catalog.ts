"use server";

import { revalidatePath } from "next/cache";
import type { PostgrestError } from "@supabase/supabase-js";
import { ensureOwnerStore } from "@/lib/admin-auth";
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

  const storeResult = await ensureOwnerStore(supabase, user.id);
  if (!storeResult.ok) return { supabase: null, store: null, error: "Nao foi possivel confirmar a loja do administrador." };
  return { supabase, store: storeResult.store, error: null };
}

function databaseMessage(error: PostgrestError, subject: string) {
  if (error.code === "23505") return `Ja existe ${subject} com este nome.`;
  if (error.code === "23503") return `${subject} ainda esta sendo usado por outro cadastro.`;
  if (error.code === "42501") return "Sua sessao expirou ou nao possui permissao. Entre novamente.";
  return `Nao foi possivel salvar ${subject}. Tente novamente.`;
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

  if (result.error) return { ok: false, message: databaseMessage(result.error, "um produto") };
  revalidatePath("/admin/produtos");
  revalidatePath(`/loja/${store.slug}`);
  return { ok: true, message: "Produto salvo com sucesso." };
}

export async function deleteProductAction(productId: string) {
  const { supabase, store, error: authError } = await requireUserStore();
  if (!supabase || !store) return { ok: false, message: authError ?? "Acesso negado." };

  const { error } = await supabase.from("products").delete().eq("id", productId).eq("store_id", store.id);
  if (error) return { ok: false, message: databaseMessage(error, "o produto") };
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

  if (result.error) return { ok: false, message: databaseMessage(result.error, "uma categoria") };
  revalidatePath("/admin/categorias");
  return { ok: true, message: "Categoria salva." };
}

export async function deleteCategoryAction(categoryId: string) {
  const { supabase, store, error: authError } = await requireUserStore();
  if (!supabase || !store) return { ok: false, message: authError ?? "Acesso negado." };

  const { error } = await supabase.from("categories").delete().eq("id", categoryId).eq("store_id", store.id);
  if (error) return { ok: false, message: databaseMessage(error, "a categoria") };
  revalidatePath("/admin/categorias");
  revalidatePath(`/loja/${store.slug}`);
  return { ok: true, message: "Categoria removida." };
}

export async function updateStoreAction(formData: FormData) {
  const parsed = storeSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: parsed.error.errors[0]?.message ?? "Dados invalidos." };

  const { supabase, store, error: authError } = await requireUserStore();
  if (!supabase || !store) return { ok: false, message: authError ?? "Acesso negado." };

  const payload = { ...parsed.data, slug: store.slug };
  const { error } = await supabase.from("stores").update(payload).eq("id", store.id).eq("owner_id", store.owner_id);
  if (error) return { ok: false, message: databaseMessage(error, "as configuracoes") };
  revalidatePath("/admin/configuracoes");
  revalidatePath(`/loja/${store.slug}`);
  return { ok: true, message: "Loja atualizada." };
}
