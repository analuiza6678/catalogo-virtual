import { demoCategories, demoProducts, demoStore } from "@/data/demo";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureOwnerStore } from "@/lib/admin-auth";
import type { Category, ProductWithCategory, Store } from "@/types/catalog";

export async function getStoreBySlug(slug: string): Promise<Store | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return slug === demoStore.slug ? demoStore : null;

  const { data } = await supabase.from("stores").select("*").eq("slug", slug).single();
  return data ?? null;
}

export async function getStoreCategories(storeId: string): Promise<Category[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase || storeId === demoStore.id) return demoCategories;

  const { data } = await supabase.from("categories").select("*").eq("store_id", storeId).order("name");
  return data ?? [];
}

export async function getStoreProducts(storeId: string): Promise<ProductWithCategory[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase || storeId === demoStore.id) return demoProducts;

  const { data } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });

  return (data as ProductWithCategory[] | null) ?? [];
}

export async function getProductByIdOrSlug(storeId: string, idOrSlug: string): Promise<ProductWithCategory | null> {
  const products = await getStoreProducts(storeId);
  return products.find((product) => product.id === idOrSlug || product.slug === idOrSlug) ?? null;
}

export async function getCurrentOwnerStore(): Promise<{ store: Store; categories: Category[]; products: ProductWithCategory[] }> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error("Supabase nao configurado.");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Sessao expirada.");
  }

  const storeResult = await ensureOwnerStore(supabase, user.id);
  if (!storeResult.ok) throw new Error("Loja do proprietario nao encontrada.");
  const store = storeResult.store;

  const [categories, products] = await Promise.all([getStoreCategories(store.id), getStoreProducts(store.id)]);
  return { store, categories, products };
}
