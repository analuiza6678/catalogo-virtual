import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getCurrentOwnerStore } from "@/lib/catalog-queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?error=config");
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: ownerStore } = await supabase.from("stores").select("id").eq("owner_id", user.id).maybeSingle();
  if (!ownerStore) redirect("/admin/login?error=store");

  const { store } = await getCurrentOwnerStore();

  return (
    <div className="min-h-screen bg-secondary/45">
      <div className="flex">
        <AdminSidebar />
        <div className="min-w-0 flex-1">
          <AdminHeader store={store} />
          <main className="p-4 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
