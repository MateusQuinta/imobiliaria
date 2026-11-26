-- ============================================
-- TABELAS FALTANTES PARA O SISTEMA FUNCIONAR
-- ============================================

-- Tabela de leads (CRM)
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT,
  message TEXT,
  property_id INTEGER REFERENCES properties(id),
  property_title TEXT,
  broker_id UUID REFERENCES admin_users(id),
  status TEXT DEFAULT 'novo' CHECK (status IN ('novo', 'em_contato', 'proposta', 'fechado', 'perdido')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de visitas agendadas
CREATE TABLE IF NOT EXISTS visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broker_id UUID REFERENCES admin_users(id),
  property_id INTEGER REFERENCES properties(id),
  property_title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'agendada' CHECK (status IN ('agendada', 'confirmada', 'realizada', 'cancelada')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de comissões
CREATE TABLE IF NOT EXISTS commissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id),
  property_title TEXT NOT NULL,
  sale_price NUMERIC NOT NULL,
  commission_rate NUMERIC DEFAULT 5,
  commission_amount NUMERIC NOT NULL,
  broker_id UUID REFERENCES admin_users(id),
  broker_name TEXT NOT NULL,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'cancelado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  user_id UUID REFERENCES admin_users(id),
  user_name TEXT,
  user_role TEXT,
  target_type TEXT,
  target_id TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- HABILITAR RLS EM TODAS AS TABELAS
-- ============================================

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS - LEADS
-- ============================================

-- Permitir inserção pública de leads
CREATE POLICY "Permitir insert público de leads" ON leads
  FOR INSERT
  WITH CHECK (true);

-- Admin pode ver todos os leads
CREATE POLICY "Admin pode ver todos os leads" ON leads
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.status = 'active'
    )
  );

-- Corretor pode ver próprios leads
CREATE POLICY "Corretor pode ver próprios leads" ON leads
  FOR SELECT
  USING (
    broker_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'corretor'
      AND admin_users.status = 'active'
    )
  );

-- Admin pode atualizar leads
CREATE POLICY "Admin pode atualizar leads" ON leads
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.status = 'active'
    )
  );

-- Corretor pode atualizar próprios leads
CREATE POLICY "Corretor pode atualizar próprios leads" ON leads
  FOR UPDATE
  USING (
    broker_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'corretor'
      AND admin_users.status = 'active'
    )
  );

-- ============================================
-- POLÍTICAS RLS - VISITS
-- ============================================

-- Usuário autenticado pode inserir visitas
CREATE POLICY "Usuário autenticado pode inserir visitas" ON visits
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Admin pode ver todas as visitas
CREATE POLICY "Admin pode ver todas as visitas" ON visits
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.status = 'active'
    )
  );

-- Corretor pode ver próprias visitas
CREATE POLICY "Corretor pode ver próprias visitas" ON visits
  FOR SELECT
  USING (
    broker_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'corretor'
      AND admin_users.status = 'active'
    )
  );

-- Admin pode atualizar visitas
CREATE POLICY "Admin pode atualizar visitas" ON visits
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.status = 'active'
    )
  );

-- Corretor pode atualizar próprias visitas
CREATE POLICY "Corretor pode atualizar próprias visitas" ON visits
  FOR UPDATE
  USING (
    broker_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'corretor'
      AND admin_users.status = 'active'
    )
  );

-- ============================================
-- POLÍTICAS RLS - COMMISSIONS
-- ============================================

-- Admin pode ver todas as comissões
CREATE POLICY "Admin pode ver todas as comissões" ON commissions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.status = 'active'
    )
  );

-- Corretor pode ver próprias comissões
CREATE POLICY "Corretor pode ver próprias comissões" ON commissions
  FOR SELECT
  USING (
    broker_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'corretor'
      AND admin_users.status = 'active'
    )
  );

-- Admin pode inserir comissões
CREATE POLICY "Admin pode inserir comissões" ON commissions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.status = 'active'
    )
  );

-- Admin pode atualizar comissões
CREATE POLICY "Admin pode atualizar comissões" ON commissions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.status = 'active'
    )
  );

-- ============================================
-- POLÍTICAS RLS - AUDIT_LOGS
-- ============================================

-- Apenas admins podem ver logs de auditoria
CREATE POLICY "Admin pode ver logs de auditoria" ON audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.status = 'active'
    )
  );

-- Usuários autenticados podem inserir logs
CREATE POLICY "Usuário autenticado pode inserir logs" ON audit_logs
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_leads_broker_id ON leads(broker_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

CREATE INDEX IF NOT EXISTS idx_visits_broker_id ON visits(broker_id);
CREATE INDEX IF NOT EXISTS idx_visits_property_id ON visits(property_id);
CREATE INDEX IF NOT EXISTS idx_visits_scheduled_date ON visits(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_visits_status ON visits(status);

CREATE INDEX IF NOT EXISTS idx_commissions_broker_id ON commissions(broker_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions(status);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
