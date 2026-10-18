-- Tabela de usuários admin
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'corretor')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected')),
  creci TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES admin_users(id)
);

-- Expandir tabela properties
ALTER TABLE properties ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES admin_users(id);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES admin_users(id);

-- Remover constraint antigo de status e adicionar novo
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_status_check;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Atualizar status para o novo formato
ALTER TABLE properties ALTER COLUMN status SET DEFAULT 'rascunho';
ALTER TABLE properties ADD CONSTRAINT properties_status_check CHECK (status IN ('rascunho', 'ativo', 'inativo', 'vendido'));

-- Adicionar coluna de status aos formulários
ALTER TABLE contact_forms ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'resolvido'));
ALTER TABLE property_inquiries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'resolvido'));

-- Habilitar RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Permitir insert público em admin_users" ON admin_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin pode ver todos os usuários" ON admin_users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pode atualizar usuários" ON admin_users FOR UPDATE USING (auth.role() = 'authenticated');

-- Políticas de propriedades (recriar se já existirem)
DROP POLICY IF EXISTS "Admin pode inserir propriedades" ON properties;
CREATE POLICY "Admin pode inserir propriedades" ON properties FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin pode atualizar propriedades" ON properties;
CREATE POLICY "Admin pode atualizar propriedades" ON properties FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin pode deletar propriedades" ON properties;
CREATE POLICY "Admin pode deletar propriedades" ON properties FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode ver leads" ON contact_forms FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pode atualizar leads" ON contact_forms FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode ver inquiries" ON property_inquiries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pode atualizar inquiries" ON property_inquiries FOR UPDATE USING (auth.role() = 'authenticated');
