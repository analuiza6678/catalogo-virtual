import type { Product, Store } from "@/types/catalog";
import { formatCurrency } from "@/lib/utils";

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function buildWhatsAppUrl(store: Store, message: string) {
  const phone = onlyDigits(store.whatsapp_number);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function productWhatsAppUrl(store: Store, product: Product, productUrl: string) {
  const template = product.whatsapp_message ??
    store.whatsapp_default_message ??
    "Ola! Tenho interesse no produto: {product}. Preco: {price}. Link: {link}. Ele ainda esta disponivel?";

  const message = template
    .replaceAll("{product}", product.name)
    .replaceAll("{price}", formatCurrency(product.price))
    .replaceAll("{link}", productUrl);

  return buildWhatsAppUrl(store, message);
}
