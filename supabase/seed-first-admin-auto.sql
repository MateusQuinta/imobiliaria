-- Script automatizado para criar o primeiro admin
-- Execute tudo de uma vez no SQL Editor do Supabase
-- Execute APÓS ter executado schema-admin.sql

-- Este script cria um admin com login/senha pré-definidos
-- LOGIN: admin@aurea-imoveis.com.br
-- SENHA: Admin123!

DO $$
DECLARE
  admin_id UUID;
BEGIN
  -- Gerar um UUID para o admin
  admin_id := gen_random_uuid();
  
  -- Criar usuário no Supabase Auth
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
    admin_id,
    'admin@aurea-imoveis.com.br',
    crypt('Admin123!', gen_salt('bf')),
    now(),
    '{"name": "Admin Principal", "role": "admin"}',
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}'
  );
  
  -- Criar registro em admin_users
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
    admin_id,
    'admin@aurea-imoveis.com.br',
    'managed_by_supabase',
    'Admin Principal',
    'admin',
    'active',
    'CRECI-SP 00000-A',
    now(),
    now(),
    admin_id -- Auto-aprovado (é o primeiro admin)
  );
  
  RAISE NOTICE 'Admin criado com sucesso! ID: %', admin_id;
  RAISE NOTICE 'Login: admin@aurea-imoveis.com.br';
  RAISE NOTICE 'Senha: Admin123!';
END $$;
