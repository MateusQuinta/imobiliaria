-- Correção para permitir NULL em campos opcionais
-- Execute no SQL Editor do Supabase

ALTER TABLE properties ALTER COLUMN beds DROP NOT NULL;
ALTER TABLE properties ALTER COLUMN baths DROP NOT NULL;
ALTER TABLE properties ALTER COLUMN parking DROP NOT NULL;
ALTER TABLE properties ALTER COLUMN image DROP NOT NULL;
