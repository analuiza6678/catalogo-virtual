import { SettingsForm } from "@/components/admin/settings-form";
import { getCurrentOwnerStore } from "@/lib/catalog-queries";

export default async function SettingsPage() {
  const { store } = await getCurrentOwnerStore();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-normal">Configuracoes da loja</h2>
        <p className="mt-2 text-muted-foreground">Personalize identidade, contato e mensagem padrao do WhatsApp.</p>
      </div>
      <SettingsForm store={store} />
    </div>
  );
}
