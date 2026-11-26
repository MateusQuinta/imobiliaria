# Relatório de Diagnóstico - Bugs no Painel Admin

**Data:** 2026-11-15
**Projeto:** Viva Belle Imobiliária
**Status:** Problemas identificados

---

## 🔴 PROBLEMAS CRÍTICOS ENCONTRADOS

### 1. Tabelas Faltantes no Supabase (CRÍTICO)

**Problema:** O código está tentando acessar tabelas que não existem no Supabase.

**Tabelas faltantes:**
- ❌ `leads` - Usada em DashboardPage, LeadsPage, api.js
- ❌ `visits` - Usada em VisitsPage, DashboardPage
- ❌ `commissions` - Usada em CommissionsPage, DashboardPage
- ❌ `audit_logs` - Usada em AuditLogsPage, api.js

**Impacto:**
- Páginas não carregam (erro 404 na API)
- Dados não são salvos
- Sistema não funciona corretamente

**Solução:**
- ✅ Criado `supabase/create-missing-tables.sql` com todas as tabelas
- ⚠️ **PRECISA EXECUTAR NO SUPABASE** antes de usar o sistema

---

### 2. Política RLS para `visits` (ALTO)

**Problema:** A tabela `visits` precisa de políticas RLS específicas.

**Solução:**
- ✅ Incluído no `create-missing-tables.sql`
- Políticas criadas para admin e corretor

---

### 3. DashboardPage usando tabelas inexistentes (ALTO)

**Problema:** DashboardPage tenta buscar dados de `leads`, `visits` e `admin_users`.

**Arquivo:** `src/pages/Admin/DashboardPage.jsx`
**Linhas:** 74, 75, 76, 77, 79, 96

**Impacto:** Dashboard não carrega corretamente.

**Solução:**
- ✅ Tabelas criadas no SQL
- ⚠️ Precisa executar o SQL no Supabase

---

### 4. api.js usando tabelas inexistentes (MÉDIO)

**Problema:** Funções de API tentam salvar em `leads` que não existe.

**Arquivo:** `src/lib/api.js`
**Linhas:** 16, 44

**Impacto:** Formulários de contato e interesse não salvam dados.

**Solução:**
- ✅ Tabela `leads` criada no SQL
- ⚠️ Precisa executar o SQL no Supabase

---

## ✅ O QUE FOI VERIFICADO E ESTÁ OK

### Rotas (App.jsx)
- ✅ Rotas configuradas corretamente
- ✅ AdminLayout tem `<Outlet />` corretamente
- ✅ Rotas aninhadas estão corretas
- ✅ Proteção de rotas funcionando

### Autenticação (useSupabaseAuth.jsx)
- ✅ Autenticação híbrida implementada
- ✅ Verificação de status do usuário
- ✅ Controle de acesso por role

### Componentes Admin
- ✅ AdminRoute protege rotas corretamente
- ✅ Sidebar navega corretamente
- ✅ Layout responsivo

---

## 🔧 AÇÕES NECESSÁRIAS

### PRIORIDADE CRÍTICA

#### 1. Executar SQL no Supabase
**Arquivo:** `supabase/create-missing-tables.sql`

**Passos:**
1. Acesse: https://supabase.com/dashboard
2. Vá para SQL Editor
3. Copie e execute o conteúdo de `create-missing-tables.sql`
4. Verifique se as tabelas foram criadas

#### 2. Verificar se tabelas existem
Após executar o SQL, verifique no Table Editor:
- ✅ `leads`
- ✅ `visits`
- ✅ `commissions`
- ✅ `audit_logs`

#### 3. Testar o sistema
Após executar o SQL:
1. Recarregue o navegador
2. Teste as páginas:
   - `/admin/properties` - Deve carregar
   - `/admin/visits` - Deve carregar
   - `/admin/leads` - Deve carregar
   - `/admin/dashboard` - Deve carregar

---

## 📋 CHECKLIST DE VERIFICAÇÃO

### Antes de executar o SQL
- [ ] Verificar se o Supabase está ativo (não pausado)
- [ ] Verificar se você tem permissão de admin no Supabase
- [ ] Fazer backup dos dados existentes (se houver)

### Após executar o SQL
- [ ] Verificar se as tabelas foram criadas
- [ ] Verificar se as políticas RLS estão funcionando
- [ ] Testar login no sistema
- [ ] Testar cadastro de imóvel
- [ ] Testar agendamento de visita
- [ ] Testar CRM de leads

---

## 🚨 PROBLEMAS ADICIONAIS IDENTIFICADOS

### 1. Tabela `properties` pode ter schema diferente
**Problema:** O schema original pode ter colunas diferentes das esperadas pelo código.

**Verificar:**
- Colunas: `title`, `type`, `price_num`, `price_display`, `neighborhood`, `address`, `city`, `beds`, `baths`, `parking`, `area`, `image`, `tags`, `status`
- Colunas adicionais: `created_by`, `updated_by`, `featured`, `moderation_status`, `cep`, `number`, `complement`

### 2. Dados mock podem estar causando confusão
**Problema:** O sistema usa dados mock quando Supabase está indisponível.

**Impacto:**
- Dados não são persistentes
- Não aparecem no Supabase
- Confusão entre modo local e Supabase

**Solução:**
- Verificar se Supabase está acessível
- Forçar uso do Supabase quando disponível

---

## 📝 PRÓXIMOS PASSOS

1. **Execute o SQL** `create-missing-tables.sql` no Supabase
2. **Teste o sistema** após executar o SQL
3. **Verifique o console** do navegador para erros
4. **Se ainda houver problemas**, me avise que investigarei mais

---

## 🔍 COMO TESTAR

### Teste 1: Verificar se tabelas existem
```sql
-- Execute no SQL Editor do Supabase
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('leads', 'visits', 'commissions', 'audit_logs');
```

### Teste 2: Verificar se políticas RLS existem
```sql
-- Execute no SQL Editor do Supabase
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('leads', 'visits', 'commissions', 'audit_logs');
```

### Teste 3: Testar no navegador
1. Acesse: http://localhost:5174/admin/login
2. Faça login
3. Teste cada aba:
   - Dashboard
   - Imóveis
   - Leads
   - Visitas
   - Comissões

---

## ✅ CONCLUSÃO

**Problema identificado:** Tabelas faltantes no Supabase.

**Solução:** Executar `create-missing-tables.sql` no Supabase.

**Status:** Aguardando execução do SQL para testar.

---

**Se após executar o SQL ainda houver problemas, me avise que investigarei mais!** 🔍
