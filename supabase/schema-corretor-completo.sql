-- ==============================================================================
-- SCHEMA COMPLETO DE CORRETORES, ADMIN E CRM IMOBILIÁRIO - VIVA BELLE
-- ==============================================================================

-- 1. Estender a tabela admin_users para suportar todos os dados profissionais
ALTER TABLE admin_users 
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS cpf TEXT,
  ADD COLUMN IF NOT EXISTS creci_uf TEXT DEFAULT 'SP',
  ADD COLUMN IF NOT EXISTS creci_type TEXT DEFAULT 'definitivo' CHECK (creci_type IN ('definitivo', 'provisorio')),
  ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'São José dos Campos',
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS creci_card_front TEXT,
  ADD COLUMN IF NOT EXISTS creci_card_back TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS correction_request TEXT,
  ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT true;

-- Atualizar constraint de status para suportar 'suspended' além de pending, active, rejected
ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_status_check;
ALTER TABLE admin_users ADD CONSTRAINT admin_users_status_check 
  CHECK (status IN ('pending', 'active', 'approved', 'rejected', 'suspended'));

-- 2. Estender a tabela properties para suportar Corretor Responsável, Galeria e Moderação
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS broker_id UUID REFERENCES admin_users(id),
  ADD COLUMN IF NOT EXISTS broker_name TEXT,
  ADD COLUMN IF NOT EXISTS broker_creci TEXT,
  ADD COLUMN IF NOT EXISTS condo_fee NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS iptu NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS suites INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS amenities TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'publicado' 
    CHECK (moderation_status IN ('rascunho', 'em_revisao', 'publicado', 'pausado', 'vendido', 'alugado'));

-- 3. Tabela de Leads Kanban e Histórico
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  subject TEXT,
  message TEXT,
  property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
  property_title TEXT,
  broker_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'novo' 
    CHECK (status IN ('novo', 'em_contato', 'visita_agendada', 'proposta', 'fechado', 'perdido')),
  loss_reason TEXT,
  notes TEXT,
  history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Agenda de Visitas
CREATE TABLE IF NOT EXISTS visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broker_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  property_title TEXT,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendada' CHECK (status IN ('agendada', 'realizada', 'cancelada')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela de Comissões e Negócios Fechados
CREATE TABLE IF NOT EXISTS commissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broker_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
  property_title TEXT NOT NULL,
  deal_value NUMERIC NOT NULL,
  commission_rate NUMERIC NOT NULL DEFAULT 6.0,
  commission_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'a_receber' CHECK (status IN ('a_receber', 'pago', 'processando')),
  closed_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela de Logs de Auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  user_name TEXT,
  user_role TEXT,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabela de Configurações da Imobiliária
CREATE TABLE IF NOT EXISTS agency_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  require_property_moderation BOOLEAN DEFAULT false,
  default_commission_rate NUMERIC DEFAULT 6.0,
  lead_distribution_rule TEXT DEFAULT 'round_robin' CHECK (lead_distribution_rule IN ('manual', 'round_robin')),
  company_name TEXT DEFAULT 'Viva Belle Imobiliária',
  company_creci TEXT DEFAULT '12345-J',
  company_phone TEXT DEFAULT '(12) 3900-0000',
  company_whatsapp TEXT DEFAULT '5512999990000',
  company_email TEXT DEFAULT 'contato@vivabelle.com.br',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir configuração padrão inicial se não existir
INSERT INTO agency_settings (require_property_moderation, default_commission_rate, lead_distribution_rule)
SELECT false, 6.0, 'round_robin'
WHERE NOT EXISTS (SELECT 1 FROM agency_settings);

-- Habilitar RLS em todas as tabelas
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS permissivas para o dashboard de desenvolvimento / autenticado
CREATE POLICY "Leads público insert" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Leads autenticado all" ON leads FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Visits autenticado all" ON visits FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Commissions autenticado all" ON commissions FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Audit logs insert público e autenticado" ON audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Audit logs select autenticado" ON audit_logs FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Agency settings select público" ON agency_settings FOR SELECT USING (true);
CREATE POLICY "Agency settings all autenticado" ON agency_settings FOR ALL USING (auth.role() = 'authenticated');

-- Bucket de Storage para Documentos de CRECI (frente e verso) e fotos
-- NOTA: No dashboard Supabase, garanta que o bucket 'broker-docs' e 'property-images' existam com permissão pública de leitura.
