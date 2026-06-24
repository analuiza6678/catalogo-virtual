import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { ensureOwnerStore } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?error=config");
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const storeResult = await ensureOwnerStore(supabase, user.id);
  if (!storeResult.ok) {
    await supabase.auth.signOut();
    redirect(`/admin/login?error=${storeResult.code === "not-owner" ? "owner-mismatch" : storeResult.code}`);
  }

  return (
    <div className="min-h-screen bg-[#faf8f3]">
      <AdminHeader store={storeResult.store} userEmail={user.email ?? "Administrador"} />
      <main className="mx-auto w-full max-w-[1320px] p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
