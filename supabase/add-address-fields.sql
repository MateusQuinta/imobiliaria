-- Adicionar campos de endereço separados na tabela properties
-- Execute no SQL Editor do Supabase

-- Adicionar coluna CEP
ALTER TABLE properties ADD COLUMN IF NOT EXISTS cep VARCHAR(10);

-- Adicionar coluna Número
ALTER TABLE properties ADD COLUMN IF NOT EXISTS number VARCHAR(20);

-- Adicionar coluna Complemento
ALTER TABLE properties ADD COLUMN IF NOT EXISTS complement VARCHAR(100);
