"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { upsertCategoryAction } from "@/app/actions/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CategoryForm() {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  function action(formData: FormData) {
    startTransition(async () => {
      const result = await upsertCategoryAction(formData);
      if (result.ok) {
        toast.success(result.message);
        formRef.current?.reset();
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <form action={action} className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm sm:flex-row" ref={formRef}>
      <Input name="name" placeholder="Nova categoria" required />
      <Button type="submit" disabled={isPending}>
        {isPending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <Plus data-icon="inline-start" />}
        Adicionar
      </Button>
    </form>
  );
}
