# Maison Catalogo

Catalogo premium em Next.js com compra assistida pelo WhatsApp e painel administrativo protegido pelo Supabase.

## Stack

- Next.js App Router, React e TypeScript
- Tailwind CSS
- Supabase Auth, Database e Storage
- Deploy no Netlify

## Rodar localmente

```bash
npm install
copy .env.example .env.local
npm run dev
```

Abra `http://localhost:3000`. O catalogo publico usa dados de demonstracao quando o Supabase nao esta configurado. O admin nunca libera acesso sem Supabase.

## 1. Criar o Supabase

1. Crie um projeto em `https://supabase.com`.
2. Abra **SQL Editor**.
3. Copie todo o conteudo de `supabase/schema.sql`.
4. Execute o SQL.

O arquivo e reaplicavel e nao apaga produtos ou configuracoes existentes. Ele cria/atualiza:

- `stores`, `categories`, `products` e `product_events`;
- RLS para leitura publica e escrita exclusiva do proprietario;
- bucket publico `catalog-images`;
- politicas de upload por pasta do usuario;
- loja `maison-catalogo` e categorias no primeiro cadastro.

## 2. Variaveis no Netlify

Em **Site configuration > Environment variables**, adicione exatamente:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLIC
NEXT_PUBLIC_SITE_URL=https://SEU-SITE.netlify.app
NEXT_PUBLIC_STORE_SLUG=maison-catalogo
```

Use a chave **anon public**. Nao adicione `service_role` ao frontend ou ao Netlify.

Depois de salvar as variaveis, execute um novo deploy em **Deploys > Trigger deploy > Clear cache and deploy site**.

## 3. URLs no Supabase

Abra **Authentication > URL Configuration**.

Site URL:

```text
https://SEU-SITE.netlify.app
```

Redirect URLs:

```text
https://SEU-SITE.netlify.app/auth/callback
https://SEU-SITE.netlify.app/**
http://localhost:3000/auth/callback
```

## 4. Primeiro administrador

1. Acesse `https://SEU-SITE.netlify.app/admin/login`.
2. Se ainda nao existir uma loja, o sistema redireciona para `/admin/setup`.
3. Preencha e-mail, senha e confirmacao.
4. Se a confirmacao de e-mail estiver habilitada, abra o e-mail do Supabase.
5. O callback cria a sessao e abre `/admin/dashboard`.

Nao existe login ou senha padrao. Depois do primeiro administrador, `/admin/setup` deixa de exibir cadastro.

Se o usuario ja existir em **Authentication > Users**, mas nao houver linha em `stores`, entre normalmente. O sistema cria e vincula a loja automaticamente quando nenhuma outra loja existe.

## 5. Redefinir senha

1. Abra `/admin/login`.
2. Clique em **Esqueci minha senha**.
3. Informe o e-mail do administrador.
4. Abra o link recebido.
5. Cadastre a nova senha em `/admin/reset-password`.

## Rotas

Publico:

- `/loja/maison-catalogo`
- `/loja/[slug]/produto/[id]`
- `/loja/[slug]/categoria/[categoria]`

Admin:

- `/admin/login`
- `/admin/setup`
- `/admin/reset-password`
- `/admin/dashboard`
- `/admin/produtos`
- `/admin/categorias`
- `/admin/configuracoes`
- `/admin/diagnostico` somente em desenvolvimento

Callback:

- `/auth/callback`

## Diagnostico local

Com `npm run dev`, acesse `/admin/diagnostico` depois de entrar. A pagina informa apenas se URL, anon key, slug, usuario e loja foram encontrados; nenhuma chave e exibida.

## Verificacao antes do deploy

```bash
npm run lint
npm run typecheck
npm run build
```

## Imagens

O painel envia JPG, PNG e WebP de ate 5 MB ao bucket `catalog-images`. Os arquivos sao gravados em uma pasta vinculada ao ID do administrador e protegidos pelas politicas do schema.
