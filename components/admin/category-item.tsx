"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { deleteCategoryAction, upsertCategoryAction } from "@/app/actions/catalog";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CategoryItem({ id, name, count }: { id: string; name: string; count: number }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function save(formData: FormData) {
    startTransition(async () => {
      const result = await upsertCategoryAction(formData);
      result.ok ? toast.success(result.message) : toast.error(result.message);
      if (result.ok) setEditing(false);
      if (result.ok) router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      const result = await deleteCategoryAction(id);
      result.ok ? toast.success(result.message) : toast.error(result.message);
      if (result.ok) setConfirming(false);
      if (result.ok) router.refresh();
    });
  }

  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm">
      {editing ? (
        <form action={save} className="flex items-center gap-2">
          <input name="id" type="hidden" value={id} />
          <Input autoFocus defaultValue={name} name="name" required />
          <Button aria-label="Salvar categoria" disabled={isPending} size="icon" type="submit">{isPending ? <Loader2 className="animate-spin" /> : <Check />}</Button>
          <Button aria-label="Cancelar edicao" onClick={() => setEditing(false)} size="icon" type="button" variant="ghost"><X /></Button>
        </form>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate font-semibold">{name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{count} {count === 1 ? "produto" : "produtos"}</p>
          </div>
          <div className="flex gap-1">
            <Button aria-label={`Editar ${name}`} onClick={() => setEditing(true)} size="icon" variant="ghost"><Pencil /></Button>
            <Button aria-label={`Excluir ${name}`} disabled={isPending} onClick={() => setConfirming(true)} size="icon" variant="ghost"><Trash2 /></Button>
          </div>
        </div>
      )}
      <ConfirmDeleteDialog description={`Remover a categoria "${name}"? Os produtos permanecem cadastrados, mas ficarao sem categoria.`} isPending={isPending} onCancel={() => setConfirming(false)} onConfirm={remove} open={confirming} title="Excluir categoria" />
    </article>
  );
}
