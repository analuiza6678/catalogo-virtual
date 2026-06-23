"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ShareButton({ title }: { title: string }) {
  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copiado para compartilhar.");
  }

  return (
    <Button variant="outline" size="lg" onClick={share}>
      <Share2 data-icon="inline-start" />
      Compartilhar
    </Button>
  );
}
