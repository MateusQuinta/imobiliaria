# Guia Rápido de Publicação (Deploy) — Viva Belle Imobiliária

Este projeto está pronto para ir ao ar em plataformas gratuitas e profissionais como **Vercel** ou **Netlify**.

## 1. Publicar o Site (Front-end React + Vite)

### Opção A: Vercel (Recomendado)
1. Acesse [vercel.com](https://vercel.com) e faça login com seu GitHub.
2. Clique em **Add New... > Project** e importe o repositório `MateusQuinta/imobiliaria`.
3. O Vercel detecta automaticamente que é um projeto **Vite**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Em **Environment Variables**, adicione (quando quiser conectar o banco real):
   - `VITE_SUPABASE_URL` = URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY` = Chave pública (anon key) do Supabase
5. Clique em **Deploy**. Em menos de 1 minuto seu site estará no ar com HTTPS!

> O arquivo `vercel.json` (se necessário para SPA) garante que rotas como `/imoveis/1` e `/admin/login` funcionem ao recarregar a página.

---

## 2. Conectar Banco de Dados Real (Supabase)

Enquanto o Supabase estiver desconectado, o site roda automaticamente em **Modo Demonstração Local** (salvando imóveis no navegador do usuário via `localStorage`). Para ativar o banco na nuvem para todos os clientes e corretores:

1. Acesse [supabase.com](https://supabase.com) e crie ou restaure seu projeto.
2. No **SQL Editor**, execute os arquivos na ordem:
   - `supabase/schema.sql` (tabelas base)
   - `supabase/schema-corretor-completo.sql` (tabelas de corretores, leads, visitas, comissões e auditoria)
3. No menu **Authentication > Users**, crie o primeiro usuário administrador (ex: `admin@vivabelle.com.br`) e execute:
   ```sql
   INSERT INTO admin_users (id, email, password_hash, name, role, status, creci)
   SELECT id, email, 'managed_by_supabase', 'Admin Principal', 'admin', 'active', '12345-J'
   FROM auth.users WHERE email = 'admin@vivabelle.com.br';
   ```
4. No menu **Storage**, crie um bucket público chamado `property-images` para hospedar as fotos dos imóveis.
5. Atualize as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no `.env.local` (local) e nas configurações do Vercel (produção).

---

## 3. Contatos e Credenciais de Demonstração (Modo Local)
- **Painel Admin / Corretor:** `/admin/login`
- **Admin:** `admin@vivabelle.com.br` / `Admin123!`
- **Corretor:** `corretor@vivabelle.com.br` / `Corretor123!`
