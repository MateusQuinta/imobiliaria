# Guia de Implementação - Próximos Passos

## 📌 STATUS ATUAL

### ✅ COMPLETO:
- Site público React + Vite + Tailwind
- Painel admin completo com autenticação
- CRUD de imóveis
- Gerenciamento de leads
- Gerenciamento de usuários admin
- Upload de imagens
- Schemas SQL preparados
- Scripts de seed para primeiro admin
- Código enviado para GitHub: https://github.com/MateusQuinta/imobiliaria

### ⏳ PENDENTE:
- Configuração do Supabase
- Execução dos schemas SQL
- Criação do bucket de storage
- Configuração de email (opcional)
- Substituição de dados fictícios por dados reais

---

## 🚀 PRÓXIMO PASSO: CONFIGURAR SUPABASE

### PASSO 1: Criar Projeto Supabase

1. Acesse: https://supabase.com
2. Faça login ou cadastro (GitHub/Google)
3. Clique em **"New Project"**
4. Preencha:
   - **Name:** `aurea-imoveis`
   - **Database Password:** (crie senha forte e **ANOTE**)
   - **Region:** South America (ou Brasil)
5. Clique em **"Create new project"**
6. Aguarde 2-3 minutos (status "Launching...")

### PASSO 2: Pegar Credenciais

1. Quando o projeto estiver pronto, vá em **Settings > API**
2. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public key** (chave longa)

### PASSO 3: Configurar Environment Variables

1. Abra o arquivo `.env.local` no projeto
2. Substitua os valores:
   ```bash
   VITE_SUPABASE_URL=https://seu-projeto-aqui.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   VITE_SITE_URL=http://localhost:5173
   ```
3. Salve o arquivo
4. Reinicie o servidor: `npm run dev`

### PASSO 4: Executar Schema SQL

1. No Supabase, vá em **SQL Editor**
2. Clique em **"New Query"**
3. Abra o arquivo `supabase/schema.sql` do projeto
4. Copie todo o conteúdo e cole no SQL Editor
5. Clique em **"Run"**
6. Repita para `supabase/schema-admin.sql`

### PASSO 5: Criar Bucket de Storage

1. No Supabase, vá em **Storage**
2. Clique em **"New bucket"**
3. Nome: `property-images`
4. Marque **"Public bucket"**
5. Clique em **"Create bucket"**
6. Vá em **Policies** do bucket
7. Adicione política de leitura pública:
   ```sql
   CREATE POLICY "Public read"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'property-images');
   ```

### PASSO 6: Criar Primeiro Admin

1. No SQL Editor, abra `supabase/seed-first-admin-auto.sql`
2. Copie e execute o script
3. Isso vai criar:
   - Email: `admin@aurea-imoveis.com.br`
   - Senha: `Admin123!`
4. Teste o login em `/admin/login`

### PASSO 7: Configurar Email (Opcional)

1. No Supabase, vá em **Edge Functions**
2. Siga o guia do Resend para configurar emails
3. Defina email da empresa para aprovações
4. Teste fluxo de cadastro/aprovação

---

## 📝 APÓS CONFIGURAÇÃO DO SUPABASE

### Testar Funcionalidades:

1. **Login Admin**
   - Acesse `/admin/login`
   - Entre com `admin@aurea-imoveis.com.br` / `Admin123!`
   - Verifique dashboard

2. **Criar Imóvel**
   - Vá em `/admin/properties/new`
   - Preencha dados de teste
   - Faça upload de imagens
   - Salve e verifique na lista

3. **Cadastrar Corretor**
   - Acesse `/admin/register`
   - Cadastre um corretor de teste
   - Vá em `/admin/admins` para aprovar

4. **Ver Leads**
   - Preencha formulário de contato no site público
   - Verifique em `/admin/leads`

---

## 🔄 SUBSTITUIR DADOS FICTÍCIOS

### Dados para Atualizar:

**1. Contato da Empresa**
- Arquivo: `src/data/index.js`
- Atualizar: telefone, WhatsApp, email, endereço, CNPJ, CRECI

**2. Imagens**
- Substituir imagens do Unsplash por fotos reais
- Upload via Supabase Storage ou hospedagem própria

**3. Imóveis**
- Criar imóveis reais via painel admin
- Ou migrar dados existentes via SQL

**4. Admin Real**
- Criar conta admin com email real da empresa
- Mudar senha do seed admin

---

## 🚀 DEPLOYMENT (Vercel)

### PASSO 1: Configurar Vercel

1. Acesse: https://vercel.com
2. Importe o repositório GitHub
3. Configure build:
   - Build Command: `npm run build`
   - Output Directory: `dist`

### PASSO 2: Environment Variables

No Vercel, adicione:
- `VITE_SUPABASE_URL` = sua URL do Supabase
- `VITE_SUPABASE_ANON_KEY` = sua anon key
- `VITE_SITE_URL` = seu domínio real

### PASSO 3: Deploy

1. Push no GitHub → deploy automático
2. Teste o site em produção
3. Configure domínio customizado

---

## 📚 ARQUIVOS DE REFERÊNCIA

### Documentação:
- `SETUP.md` - Setup geral do projeto
- `AGENTS.md` - Notas para desenvolvedores
- `docs/superpowers/specs/2026-10-14-admin-panel-design.md` - Spec do painel admin
- `docs/superpowers/plans/2026-10-14-admin-panel.md` - Plano de implementação

### Schemas SQL:
- `supabase/schema.sql` - Schema base
- `supabase/schema-admin.sql` - Schema admin
- `supabase/seed-first-admin.sql` - Seed manual
- `supabase/seed-first-admin-auto.sql` - Seed automático

### Configuração:
- `.env.example` - Template de variáveis de ambiente
- `.env.local` - Variáveis locais (criado, precisa editar)

---

## ⚠️ NOTAS IMPORTANTES

1. **Nunca comite `.env.local`** - contém credenciais sensíveis
2. **Anote a senha do Supabase** - não há como recuperar
3. **Teste em ambiente local antes de deploy**
4. **Faça backup dos dados** periodicamente
5. **Configure rate limiting** em produção

---

## 🎯 CHECKLIST FINAL

- [ ] Projeto Supabase criado
- [ ] Credenciais configuradas em `.env.local`
- [ ] Schema base executado
- [ ] Schema admin executado
- [ ] Bucket `property-images` criado
- [ ] Políticas de storage configuradas
- [ ] Primeiro admin criado via seed
- [ ] Login admin testado
- [ ] CRUD de imóveis testado
- [ ] Upload de imagens testado
- [ ] Cadastro de corretor testado
- [ ] Aprovação de admin testada
- [ ] Leads testados
- [ ] Dados fictícios substituídos
- [ ] Email configurado (opcional)
- [ ] Deploy em Vercel
- [ ] Domínio configurado
- [ ] Site em produção testado

---

## 📞 SUPORTE

Se precisar de ajuda:
- Verificar logs do console do navegador
- Verificar logs do Supabase
- Verificar variáveis de ambiente
- Consultar documentação do Supabase: https://supabase.com/docs

---

**Data:** 2026-10-16
**Status:** Aguardando configuração do Supabase
**Próximo:** Criar projeto Supabase e configurar credenciais
