"use server";

import { redirect } from "next/navigation";
import type { AuthError } from "@supabase/supabase-js";
import { ensureOwnerStore, getAdminBootstrapState, getAuthenticatedUser } from "@/lib/admin-auth";
import { getSupabaseConfigStatus } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { emailSchema, loginSchema, passwordResetSchema, signupSchema } from "@/lib/validators";

function validationCode(issues: { path: PropertyKey[] }[]) {
  const field = String(issues[0]?.path[0] ?? "");
  if (field === "email") return "invalid-email";
  if (field === "confirmPassword") return "password-mismatch";
  return "short-password";
}

function authErrorCode(error: AuthError, fallback: string) {
  const code = error.code ?? "";
  const message = error.message.toLowerCase();
  if (code === "email_not_confirmed" || message.includes("email not confirmed")) return "email-not-confirmed";
  if (code === "invalid_credentials" || message.includes("invalid login credentials")) return "credentials";
  if (code.includes("user_not_found") || message.includes("user not found")) return "user-not-found";
  if (code.includes("weak_password") || message.includes("password")) return "short-password";
  if (code.includes("user_already") || message.includes("already registered")) return "owner-exists";
  if (message.includes("invalid email")) return "invalid-email";
  if (message.includes("database error")) return "schema";
  if (message.includes("redirect") || message.includes("callback")) return "callback";
  return fallback;
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) redirect(`/admin/login?error=${validationCode(parsed.error.issues)}`);

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?error=config");

  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) redirect(`/admin/login?error=${authErrorCode(error, "login")}`);

  const storeResult = await ensureOwnerStore(supabase, data.user.id);
  if (!storeResult.ok) {
    await supabase.auth.signOut();
    redirect(`/admin/login?error=${storeResult.code === "not-owner" ? "owner-mismatch" : storeResult.code}`);
  }

  redirect("/admin/dashboard");
}

export async function setupAdminAction(formData: FormData) {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });
  if (!parsed.success) redirect(`/admin/setup?error=${validationCode(parsed.error.issues)}`);

  const bootstrap = await getAdminBootstrapState();
  if (bootstrap.kind === "missing-config") redirect("/admin/setup?error=config");
  if (bootstrap.kind === "schema-error") redirect("/admin/setup?error=schema");
  if (bootstrap.kind === "ready") redirect("/admin/login?error=owner-exists");

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/setup?error=config");
  const config = getSupabaseConfigStatus();
  if (!config.siteUrl) redirect("/admin/setup?error=site-url");

  const callback = `${config.siteUrl}/auth/callback?next=/admin/dashboard&status=verified`;
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { emailRedirectTo: callback }
  });
  if (error) redirect(`/admin/setup?error=${authErrorCode(error, "signup")}`);

  if (data.session && data.user) {
    const storeResult = await ensureOwnerStore(supabase, data.user.id);
    if (!storeResult.ok) redirect(`/admin/setup?error=${storeResult.code}`);
    redirect("/admin/dashboard");
  }

  redirect("/admin/login?status=confirm");
}

export async function requestPasswordResetAction(formData: FormData) {
  const parsed = emailSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) redirect("/admin/login?view=forgot&error=invalid-email");

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?view=forgot&error=config");
  const config = getSupabaseConfigStatus();
  if (!config.siteUrl) redirect("/admin/login?view=forgot&error=site-url");

  const redirectTo = `${config.siteUrl}/auth/callback?next=/admin/reset-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo });
  if (error) redirect(`/admin/login?view=forgot&error=${authErrorCode(error, "reset")}`);
  redirect("/admin/login?status=reset-sent");
}

export async function updatePasswordAction(formData: FormData) {
  const parsed = passwordResetSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });
  if (!parsed.success) redirect(`/admin/reset-password?error=${validationCode(parsed.error.issues)}`);

  const { supabase, user } = await getAuthenticatedUser();
  if (!supabase) redirect("/admin/login?error=config");
  if (!user) redirect("/admin/login?error=reset-session");

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) redirect(`/admin/reset-password?error=${authErrorCode(error, "password-update")}`);
  await supabase.auth.signOut();
  redirect("/admin/login?status=password-updated");
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}
