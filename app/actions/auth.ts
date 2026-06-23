"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema } from "@/lib/validators";

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

  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) redirect("/admin/login?error=credentials");

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

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}
