"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteProductAction } from "@/app/actions/catalog";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { Button } from "@/components/ui/button";

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function remove() {
    startTransition(async () => {
      const result = await deleteProductAction(productId);
      if (result.ok) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <>
      <Button variant="outline" size="icon" aria-label="Excluir produto" onClick={() => setOpen(true)} disabled={isPending}>
        <Trash2 />
      </Button>
      <ConfirmDeleteDialog
        open={open}
        title="Excluir produto"
        description={`Excluir "${productName}"? Esta acao nao pode ser desfeita.`}
        isPending={isPending}
        onCancel={() => setOpen(false)}
        onConfirm={remove}
      />
    </>
  );
}
