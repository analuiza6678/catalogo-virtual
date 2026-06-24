import "server-only";

import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseConfigStatus, type SupabaseConfigStatus } from "@/lib/supabase/config";
import type { Store } from "@/types/catalog";

const DEFAULT_CATEGORIES = ["Bolsas", "Colares", "Brincos", "Pulseiras", "Aneis", "Oculos", "Relogios", "Kits", "Presentes"];

export type AdminBootstrapState =
  | { kind: "missing-config"; config: SupabaseConfigStatus }
  | { kind: "schema-error"; config: SupabaseConfigStatus; detail: string }
  | { kind: "needs-setup"; config: SupabaseConfigStatus }
  | { kind: "ready"; config: SupabaseConfigStatus; ownerId: string; storeSlug: string };

export type EnsureStoreResult =
  | { ok: true; store: Store; created: boolean }
  | { ok: false; code: "schema" | "not-owner" | "store-create"; detail?: string };

export async function getAdminBootstrapState(): Promise<AdminBootstrapState> {
  const config = getSupabaseConfigStatus();
  if (!config.isConfigured) return { kind: "missing-config", config };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { kind: "missing-config", config };

  const { data, error } = await supabase.from("stores").select("owner_id, slug").limit(1).maybeSingle();
  if (error) return { kind: "schema-error", config, detail: error.message };
  if (!data) return { kind: "needs-setup", config };
  return { kind: "ready", config, ownerId: data.owner_id, storeSlug: data.slug };
}

export async function getAuthenticatedUser(): Promise<{ supabase: SupabaseClient | null; user: User | null }> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { supabase: null, user: null };
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function ensureOwnerStore(supabase: SupabaseClient, userId: string): Promise<EnsureStoreResult> {
  const { data: ownedStore, error: ownedStoreError } = await supabase
    .from("stores")
    .select("*")
    .eq("owner_id", userId)
    .maybeSingle();
  if (ownedStoreError) return { ok: false, code: "schema", detail: ownedStoreError.message };

  if (ownedStore) {
    const categoryError = await ensureDefaultCategories(supabase, ownedStore.id);
    if (categoryError) return { ok: false, code: "schema", detail: categoryError };
    return { ok: true, store: ownedStore as Store, created: false };
  }

  const { data: existingStore, error: existingStoreError } = await supabase.from("stores").select("owner_id").limit(1).maybeSingle();
  if (existingStoreError) return { ok: false, code: "schema", detail: existingStoreError.message };
  if (existingStore && existingStore.owner_id !== userId) return { ok: false, code: "not-owner" };

  const config = getSupabaseConfigStatus();
  const { data: createdStore, error: createError } = await supabase
    .from("stores")
    .insert({
      owner_id: userId,
      name: "Maison Catalogo",
      slug: config.storeSlug,
      description: "Curadoria feminina premium com atendimento humano pelo WhatsApp.",
      whatsapp_number: "5599999999999",
      whatsapp_default_message: "Ola! Tenho interesse no produto {product}. Preco: {price}. Link: {link}.",
      primary_color: "#C8A96A"
    })
    .select("*")
    .single();
  if (createError || !createdStore) return { ok: false, code: "store-create", detail: createError?.message };

  const categoryError = await ensureDefaultCategories(supabase, createdStore.id);
  if (categoryError) return { ok: false, code: "schema", detail: categoryError };
  return { ok: true, store: createdStore as Store, created: true };
}

async function ensureDefaultCategories(supabase: SupabaseClient, storeId: string) {
  const rows = DEFAULT_CATEGORIES.map((name) => ({
    store_id: storeId,
    name,
    slug: slugify(name)
  }));
  const { error } = await supabase.from("categories").upsert(rows, { onConflict: "store_id,slug", ignoreDuplicates: true });
  return error?.message ?? null;
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
