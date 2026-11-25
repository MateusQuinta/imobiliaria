-- Políticas de Segurança RLS - Versão Blindada
-- Execute no SQL Editor do Supabase APÓS ter executado schema-admin.sql

-- ============================================
-- ADMIN_USERS - Controle de acesso rigoroso
-- ============================================

-- Remover políticas antigas permissivas
DROP POLICY IF EXISTS "Permitir insert público em admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admin pode ver todos os usuários" ON admin_users;
DROP POLICY IF EXISTS "Admin pode atualizar usuários" ON admin_users;

-- Permitir apenas inserção pública (cadastro de corretores)
CREATE POLICY "Permitir cadastro público de corretores" ON admin_users
  FOR INSERT
  WITH CHECK (
    status = 'pending' AND
    role = 'corretor' AND
    auth.uid() IS NULL
  );

-- Admins podem ver todos os usuários
CREATE POLICY "Admin pode ver todos os usuários" ON admin_users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.status = 'active'
    )
  );

-- Admins podem atualizar usuários
CREATE POLICY "Admin pode atualizar usuários" ON admin_users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.status = 'active'
    )
  );

-- Usuários podem ver apenas seu próprio perfil
CREATE POLICY "Usuário pode ver próprio perfil" ON admin_users
  FOR SELECT
  USING (auth.uid() = id);

-- ============================================
-- PROPERTIES - Controle de acesso rigoroso
-- ============================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "Admin pode inserir propriedades" ON properties;
DROP POLICY IF EXISTS "Admin pode atualizar propriedades" ON properties;
DROP POLICY IF EXISTS "Admin pode deletar propriedades" ON properties;
DROP POLICY IF EXISTS "Admin pode ver propriedades" ON properties;

-- Qualquer usuário autenticado pode inserir propriedades
CREATE POLICY "Usuário autenticado pode inserir propriedades" ON properties
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Admins e corretores podem ver propriedades ativas
CREATE POLICY "Ver propriedades ativas" ON properties
  FOR SELECT
  USING (
    status = 'ativo' OR
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.status = 'active'
    )
  );

-- Admins podem atualizar qualquer propriedade
CREATE POLICY "Admin pode atualizar propriedades" ON properties
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.status = 'active'
    )
  );

-- Corretor pode atualizar apenas suas próprias propriedades
CREATE POLICY "Corretor pode atualizar próprias propriedades" ON properties
  FOR UPDATE
  USING (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'corretor'
      AND admin_users.status = 'active'
    )
  );

-- Apenas admins podem deletar propriedades
CREATE POLICY "Admin pode deletar propriedades" ON properties
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.status = 'active'
    )
  );

-- ============================================
-- CONTACT_FORMS - Controle de acesso
-- ============================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "Admin pode ver leads" ON contact_forms;
DROP POLICY IF EXISTS "Admin pode atualizar leads" ON contact_forms;

-- Permitir inserção pública de formulários de contato
CREATE POLICY "Permitir insert público de contato" ON contact_forms
  FOR INSERT
  WITH CHECK (true);

-- Apenas admins podem ver formulários
CREATE POLICY "Admin pode ver formulários de contato" ON contact_forms
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.status = 'active'
    )
  );

-- Apenas admins podem atualizar formulários
CREATE POLICY "Admin pode atualizar formulários" ON contact_forms
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
-- PROPERTY_INQUIRIES - Controle de acesso
-- ============================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "Admin pode ver inquiries" ON property_inquiries;
DROP POLICY IF EXISTS "Admin pode atualizar inquiries" ON property_inquiries;

-- Permitir inserção pública de consultas
CREATE POLICY "Permitir insert público de consultas" ON property_inquiries
  FOR INSERT
  WITH CHECK (true);

-- Apenas admins podem ver consultas
CREATE POLICY "Admin pode ver consultas" ON property_inquiries
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.status = 'active'
    )
  );

-- Apenas admins podem atualizar consultas
CREATE POLICY "Admin pode atualizar consultas" ON property_inquiries
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.status = 'active'
    )
  );
