-- Correção do status da tabela properties
-- Execute isso no SQL Editor do Supabase

-- Remover constraint antigo
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_status_check;

-- Adicionar coluna featured se não existir
ALTER TABLE properties ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Adicionar colunas de admin se não existirem
ALTER TABLE properties ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES admin_users(id);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES admin_users(id);

-- Atualizar o constraint de status para o novo formato
ALTER TABLE properties ALTER COLUMN status SET DEFAULT 'rascunho';
ALTER TABLE properties ADD CONSTRAINT properties_status_check CHECK (status IN ('rascunho', 'ativo', 'inativo', 'vendido'));
