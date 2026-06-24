"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { updateStoreAction } from "@/app/actions/catalog";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Store } from "@/types/catalog";

export function SettingsForm({ store }: { store: Store }) {
  const [isPending, startTransition] = useTransition();
  const [logoUrl, setLogoUrl] = useState(store.logo_url ?? "");
  const [bannerUrl, setBannerUrl] = useState(store.banner_url ?? "");

  function action(formData: FormData) {
    startTransition(async () => {
      const result = await updateStoreAction(formData);
      if (result.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <form action={action} className="grid gap-5 rounded-lg border bg-white p-6 shadow-sm md:grid-cols-2">
      <Field label="Nome da loja"><Input name="name" defaultValue={store.name} required /></Field>
      <input name="slug" type="hidden" value={store.slug} />
      <div>
        <Field label="Logo da loja"><ImageUploadField folder="branding" onChange={setLogoUrl} value={logoUrl} /></Field>
        <input name="logo_url" type="hidden" value={logoUrl} />
      </div>
      <div>
        <Field label="Imagem principal"><ImageUploadField folder="branding" onChange={setBannerUrl} value={bannerUrl} /></Field>
        <input name="banner_url" type="hidden" value={bannerUrl} />
      </div>
      <Field label="WhatsApp"><Input name="whatsapp_number" defaultValue={store.whatsapp_number} required /></Field>
      <Field label="Cor principal"><Input name="primary_color" defaultValue={store.primary_color} type="color" /></Field>
      <Field label="Endereco"><Input name="address" defaultValue={store.address ?? ""} /></Field>
      <Field label="Horario de atendimento"><Input name="business_hours" defaultValue={store.business_hours ?? ""} /></Field>
      <Field label="Instagram"><Input name="instagram_url" defaultValue={store.instagram_url ?? ""} /></Field>
      <Field label="Mensagem padrao do WhatsApp">
        <Textarea name="whatsapp_default_message" defaultValue={store.whatsapp_default_message ?? ""} />
      </Field>
      <div className="md:col-span-2">
        <Field label="Descricao da loja"><Textarea name="description" defaultValue={store.description} required /></Field>
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <Save data-icon="inline-start" />}
          Salvar configuracoes
        </Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <Label>{label}</Label>
      {children}
    </label>
  );
}
