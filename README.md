# Catalogo WhatsApp Premium

Aplicacao Next.js completa para lojas exibirem produtos em um catalogo digital premium e converterem pedidos pelo WhatsApp.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase Auth, Database e Storage
- shadcn/ui como base de componentes
- Lucide Icons
- Zod e React Hook Form
- Pronto para Vercel

## Como rodar

1. Instale dependencias:

```bash
npm install
```

2. Crie `.env.local` a partir de `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_STORE_SLUG=maison-catalogo
```

3. Rode localmente:

```bash
npm run dev
```

Abra `http://localhost:3000`. Sem variaveis do Supabase, o projeto usa dados de demonstracao.

## Supabase

1. Crie um projeto no Supabase.
2. Em SQL Editor, execute `supabase/schema.sql`.
3. Acesse `/admin/login?mode=register` e crie a primeira conta proprietaria.
4. Confirme o e-mail, caso essa opcao esteja ativa no Supabase.
5. O schema cria automaticamente a loja e o bucket `catalog-images`.
6. Configure as variaveis de ambiente na Vercel e localmente.

Em Authentication > URL Configuration, adicione a URL publicada em `Site URL` e em `Redirect URLs` para que a confirmacao de e-mail volte corretamente ao painel.

## Rotas

Publico:

- `/loja/[slug]`
- `/loja/[slug]/produto/[id]`
- `/loja/[slug]/categoria/[categoria]`

Admin:

- `/admin/login`
- `/admin/dashboard`
- `/admin/produtos`
- `/admin/produtos/novo`
- `/admin/produtos/[id]/editar`
- `/admin/categorias`
- `/admin/configuracoes`

## Deploy na Vercel

1. Envie o projeto para um repositorio.
2. Importe na Vercel.
3. Configure as variaveis de ambiente.
4. Rode o deploy.

O projeto usa `NEXT_PUBLIC_SITE_URL` para montar links compartilhaveis e mensagens do WhatsApp. No deploy, use a URL final da Vercel ou do dominio proprio.

## Editar produtos sem Supabase

Enquanto estiver usando o modo demonstracao, edite loja, categorias e produtos em `data/products.ts`.

Cada produto tem campos como nome, preco, imagem, categoria, descricao, `is_featured` para destaque e `is_promotion` para promocoes automaticas.
