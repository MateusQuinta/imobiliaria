-- Supabase Schema para Viva Belle Imobiliária
-- Execute estas queries no SQL Editor do Supabase

-- Tabela de formulários de contato
CREATE TABLE contact_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  consent BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de interesse em imóveis
CREATE TABLE property_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de imóveis (para quando tiver dados reais)
CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('VENDA', 'ALUGUEL', 'LANÇAMENTO')),
  price_num NUMERIC NOT NULL,
  price_display TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'São Paulo',
  beds INTEGER NOT NULL,
  baths INTEGER NOT NULL,
  parking INTEGER NOT NULL,
  area INTEGER NOT NULL,
  image TEXT NOT NULL,
  tags TEXT[],
  highlight TEXT,
  is_new BOOLEAN DEFAULT false,
  description TEXT,
  status TEXT DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'reservado', 'vendido', 'alugado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE contact_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança (permite insert público)
CREATE POLICY "Permitir insert público em contact_forms"
  ON contact_forms FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir insert público em property_inquiries"
  ON property_inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Todos podem ver propriedades"
  ON properties FOR SELECT
  USING (true);

-- Índices para performance
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_neighborhood ON properties(neighborhood);
CREATE INDEX idx_properties_price ON properties(price_num);
CREATE INDEX idx_properties_status ON properties(status);

-- Para sistema de admin, veja schema-admin.sql
-- Execute: supabase/schema-admin.sql
