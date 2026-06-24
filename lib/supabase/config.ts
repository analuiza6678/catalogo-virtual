export const REQUIRED_SUPABASE_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_STORE_SLUG"
] as const;

export type SupabaseConfigStatus = {
  supabaseUrl: string;
  anonKey: string;
  siteUrl: string;
  storeSlug: string;
  missing: string[];
  invalid: string[];
  isConfigured: boolean;
};

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || (url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname));
  } catch {
    return false;
  }
}

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ?? "";
  const storeSlug = process.env.NEXT_PUBLIC_STORE_SLUG?.trim() ?? "";
  const values: Record<(typeof REQUIRED_SUPABASE_ENV)[number], string> = {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
    NEXT_PUBLIC_SITE_URL: siteUrl,
    NEXT_PUBLIC_STORE_SLUG: storeSlug
  };
  const missing = REQUIRED_SUPABASE_ENV.filter((name) => !values[name]);
  const invalid: string[] = [];

  if (supabaseUrl && (!isValidHttpUrl(supabaseUrl) || !supabaseUrl.includes(".supabase.co"))) {
    invalid.push("NEXT_PUBLIC_SUPABASE_URL");
  }
  if (siteUrl && !isValidHttpUrl(siteUrl)) invalid.push("NEXT_PUBLIC_SITE_URL");
  if (storeSlug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(storeSlug)) invalid.push("NEXT_PUBLIC_STORE_SLUG");

  return {
    supabaseUrl,
    anonKey,
    siteUrl,
    storeSlug: storeSlug || "maison-catalogo",
    missing,
    invalid,
    isConfigured: missing.length === 0 && invalid.length === 0
  };
}

