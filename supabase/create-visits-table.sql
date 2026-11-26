-- Tabela de visitas agendadas
CREATE TABLE visits (
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

-- Habilitar RLS
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Usuário autenticado pode inserir visitas" ON visits
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

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

-- Índices para performance
CREATE INDEX idx_visits_broker_id ON visits(broker_id);
CREATE INDEX idx_visits_property_id ON visits(property_id);
CREATE INDEX idx_visits_scheduled_date ON visits(scheduled_date);
CREATE INDEX idx_visits_status ON visits(status);
