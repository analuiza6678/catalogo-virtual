"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { upsertCategoryAction } from "@/app/actions/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CategoryForm() {
  const [isPending, startTransition] = useTransition();

  function action(formData: FormData) {
    startTransition(async () => {
      const result = await upsertCategoryAction(formData);
      if (result.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <form action={action} className="flex flex-col gap-3 rounded-lg border bg-white p-5 shadow-sm sm:flex-row">
      <Input name="name" placeholder="Nova categoria" required />
      <Button type="submit" disabled={isPending}>
        {isPending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <Plus data-icon="inline-start" />}
        Adicionar
      </Button>
    </form>
  );
}
