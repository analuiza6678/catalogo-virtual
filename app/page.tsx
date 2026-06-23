import { redirect } from "next/navigation";

export default function HomePage() {
  redirect(`/loja/${process.env.NEXT_PUBLIC_STORE_SLUG ?? "maison-catalogo"}`);
}
