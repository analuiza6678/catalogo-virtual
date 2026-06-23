"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConfirmDeleteDialog({
  open,
  title,
  description,
  isPending,
  onCancel,
  onConfirm
}: {
  open: boolean;
  title: string;
  description: string;
  isPending?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="delete-title">
      <div className="w-full max-w-md rounded-lg border bg-white p-5 shadow-premium">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="delete-title" className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel} aria-label="Fechar">
            <X />
          </Button>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isPending}>Excluir</Button>
        </div>
      </div>
    </div>
  );
}
