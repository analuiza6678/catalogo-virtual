"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { emailSchema, loginSchema, passwordResetSchema, signupSchema } from "@/lib/validators";

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    redirect("/admin/login?error=invalid");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect("/admin/login?error=config");
  }

  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) redirect("/admin/login?error=credentials");

  const { data: ownerStore, error: storeQueryError } = await supabase
    .from("stores")
    .select("id")
    .eq("owner_id", data.user.id)
    .maybeSingle();
  if (storeQueryError) redirect("/admin/login?error=schema");

  if (!ownerStore) {
    const { count } = await supabase.from("stores").select("id", { count: "exact", head: true });
    if (count && count > 0) {
      await supabase.auth.signOut();
      redirect("/admin/login?error=owner-mismatch");
    }

    const { error: createStoreError } = await supabase.from("stores").insert({
      owner_id: data.user.id,
      name: "Maison Catalogo",
      slug: "maison-catalogo",
      description: "Curadoria feminina premium com atendimento humano pelo WhatsApp.",
      whatsapp_number: "5599999999999",
      whatsapp_default_message: "Ola! Tenho interesse no produto {product}. Preco: {price}. Link: {link}.",
      primary_color: "#C8A96A"
    });
    if (createStoreError) redirect("/admin/login?error=store-create");
  }

  redirect("/admin/dashboard");
}

export async function signupAction(formData: FormData) {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });
  if (!parsed.success) redirect("/admin/login?mode=register&error=signup");

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?mode=register&error=config");

  const { count } = await supabase.from("stores").select("id", { count: "exact", head: true });
  if (count && count > 0) redirect("/admin/login?error=owner-exists");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: siteUrl ? { emailRedirectTo: `${siteUrl}/admin/login?status=verified` } : undefined
  });

  if (error) redirect("/admin/login?mode=register&error=account");
  if (data.session) redirect("/admin/dashboard");
  redirect("/admin/login?status=confirm");
}

export async function requestPasswordResetAction(formData: FormData) {
  const parsed = emailSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) redirect("/admin/login?mode=forgot&error=email");

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?mode=forgot&error=config");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!siteUrl) redirect("/admin/login?mode=forgot&error=site-url");

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/auth/callback?next=/admin/reset-password`
  });
  if (error) redirect("/admin/login?mode=forgot&error=reset");
  redirect("/admin/login?status=reset-sent");
}

export async function updatePasswordAction(formData: FormData) {
  const parsed = passwordResetSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });
  if (!parsed.success) redirect("/admin/reset-password?error=invalid");

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?error=config");
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) redirect("/admin/reset-password?error=update");

  await supabase.auth.signOut();
  redirect("/admin/login?status=password-updated");
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}
