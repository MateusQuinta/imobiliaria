-- Script para criar o primeiro admin manualmente
-- Execute isso no SQL Editor do Supabase APÓS executar schema-admin.sql

-- Importante: Substitua os valores abaixo com os dados reais do primeiro admin
-- Este script cria um usuário no Supabase Auth e o registro correspondente em admin_users

-- Passo 1: Criar usuário no Supabase Auth
-- Nota: Você precisará da senha em texto plano para este comando
-- Substitua 'admin@suaempresa.com' e 'sua_senha_aqui' pelos valores reais

INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  last_sign_in_at,
  raw_app_meta_data
) VALUES (
  gen_random_uuid(),
  'admin@aurea-imoveis.com.br',
  crypt('Admin123!', gen_salt('bf')),
  now(),
  '{"name": "Admin Principal", "role": "admin"}',
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}'
);

-- Passo 2: Criar registro em admin_users
-- O email deve ser o mesmo do passo 1
-- Este ID precisa ser o mesmo ID gerado no passo 1, então vamos buscar primeiro

-- Execute este bloco ATUALIZADO com o ID real gerado no passo 1:
-- Primeiro, execute o passo 1 acima, depois pegue o ID que foi gerado e substitua abaixo:

INSERT INTO admin_users (
  id,
  email,
  password_hash,
  name,
  role,
  status,
  creci,
  created_at,
  approved_at,
  approved_by
) VALUES (
  -- SUBSTITUA ESTE UUID PELO ID GERADO NO PASSO 1
  'SUBSTITUIR-PELO-ID-DO-PASSO-1',
  'admin@aurea-imoveis.com.br',
  'managed_by_supabase',
  'Admin Principal',
  'admin',
  'active',
  'CRECI-SP 00000-A',
  now(),
  now(),
  'SUBSTITUIR-PELO-ID-DO-PASSO-1' -- Auto-aprovado (é o primeiro admin)
);

-- INSTRUÇÕES:
-- 1. Execute o primeiro INSERT (auth.users)
-- 2. Copie o ID que foi gerado (vai aparecer no resultado)
-- 3. Substitua 'SUBSTITUIR-PELO-ID-DO-PASSO-1' nos dois lugares do segundo INSERT
-- 4. Execute o segundo INSERT (admin_users)
-- 5. Você pode fazer login com: admin@aurea-imoveis.com.br / Admin123!
