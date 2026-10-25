-- Script automatizado para criar o primeiro admin
-- Execute tudo de uma vez no SQL Editor do Supabase
-- Execute APÓS ter executado schema-admin.sql

-- Este script cria um admin com login/senha pré-definidos
-- LOGIN: admin@vivabelle.com.br
-- SENHA: Admin123!

DO $$
DECLARE
  admin_id UUID;
  user_exists BOOLEAN;
BEGIN
  -- Verificar se o usuário já existe no Supabase Auth
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'admin@vivabelle.com.br') INTO user_exists;

  IF user_exists THEN
    -- Usuário já existe, pegar o ID
    SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@vivabelle.com.br';
    RAISE NOTICE 'Usuário já existe no Supabase Auth. ID: %', admin_id;
  ELSE
    -- Criar usuário no Supabase Auth
    admin_id := gen_random_uuid();

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
      'admin@vivabelle.com.br',
      crypt('Admin123!', gen_salt('bf')),
      now(),
      '{"name": "Admin Principal", "role": "admin"}',
      now(),
      now(),
      now(),
      '{"provider": "email", "providers": ["email"]}'
    );

    RAISE NOTICE 'Usuário criado no Supabase Auth. ID: %', admin_id;
  END IF;

  -- Verificar se já existe em admin_users
  IF EXISTS(SELECT 1 FROM admin_users WHERE email = 'admin@vivabelle.com.br') THEN
    -- Atualizar para active se já existir
    UPDATE admin_users
    SET status = 'active',
        approved_at = now(),
        approved_by = admin_id
    WHERE email = 'admin@vivabelle.com.br';
    RAISE NOTICE 'Admin atualizado para active';
  ELSE
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
      'admin@vivabelle.com.br',
      'managed_by_supabase',
      'Admin Principal',
      'admin',
      'active',
      'CRECI-SP 00000-A',
      now(),
      now(),
      admin_id -- Auto-aprovado (é o primeiro admin)
    );

    RAISE NOTICE 'Admin criado com sucesso!';
  END IF;

  RAISE NOTICE 'Login: admin@vivabelle.com.br';
  RAISE NOTICE 'Senha: Admin123!';
END $$;
