# Admin Panel Design Spec

**Date:** 2026-10-14
**Project:** Viva Belle Imobiliária - Admin Panel
**Type:** New Subsystem (Architectural)

## Overview

Implementar um painel administrativo completo para gerenciamento de imóveis, leads e usuários admin, com sistema de autenticação e aprovação de cadastro via email.

## Requirements

### Functional Requirements

#### 1. Authentication & Authorization
- Login com email e senha usando Supabase Auth
- Cadastro público para corretores solicitarem acesso
- Sistema de aprovação manual por email
- Role-based access control (RBAC):
  - `admin`: acesso total
  - `corretor`: gerenciar apenas imóveis próprios
- Rota `/admin` protegida - redireciona para login se não autenticado

#### 2. Property Management (CRUD)
- Criar novos imóveis com upload de imagens
- Editar imóveis existentes
- Deletar imóveis (soft delete)
- Marcar imóveis como: rascunho, ativo, inativo, vendido
- Marcar imóveis como featured (destaque na home)
- Upload de imagens via Supabase Storage
- Preview do imóvel como aparece no site público

#### 3. Lead Management
- Visualizar formulários de contato
- Visualizar interesse em imóveis específicos
- Marcar leads como resolvido/pendente

#### 4. Admin User Management
- Lista de usuários admin
- Aprovar/rejeitar cadastros pendentes
- Editar role de usuários
- Desativar usuários

#### 5. Email Notifications
- Email para admin da empresa quando novo cadastro pendente
- Email de confirmação quando cadastro aprovado
- Email de notificação quando cadastro rejeitado

### Non-Functional Requirements

- Performance: carregamento de listas < 2s
- Security: RLS no Supabase, autenticação em todas as rotas admin
- Mobile-responsive: painel funcional em dispositivos móveis
- Accessibility: WCAG 2.1 AA compliance

## Architecture

### Database Schema

#### Table: `admin_users`
```sql
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
```

#### Table: `properties` (expansion)
```sql
ALTER TABLE properties ADD COLUMN created_by UUID REFERENCES admin_users(id);
ALTER TABLE properties ADD COLUMN updated_by UUID REFERENCES admin_users(id);
ALTER TABLE properties ADD COLUMN status TEXT DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'ativo', 'inativo', 'vendido'));
ALTER TABLE properties ADD COLUMN featured BOOLEAN DEFAULT false;
```

### Supabase Storage

**Bucket:** `property-images`
- Public read access
- Write access only for authenticated admins
- Organização por property_id: `/properties/{property_id}/{image_name}`

### Edge Functions

**1. `send-approval-email`**
- Trigger: quando novo admin_user criado com status 'pending'
- Action: envia email para email fixo da empresa
- Contém: link para página de aprovação

**2. `send-approval-notification`**
- Trigger: quando status muda para 'active' ou 'rejected'
- Action: envia email para o usuário
- Contém: mensagem de aprovação/rejeição

### Frontend Routes

```
/admin/login              - Login page
/admin/register           - Registration page (public)
/admin/dashboard          - Dashboard
/admin/properties         - Property list
/admin/properties/new     - Create property
/admin/properties/:id/edit - Edit property
/admin/leads              - Lead list
/admin/admins             - Admin user list
/admin/admins/:id/approve - Approve admin
```

### Component Structure

```
src/pages/Admin/
├── AdminLayout.jsx          - Layout com sidebar
├── LoginPage.jsx            - Login
├── RegisterPage.jsx         - Cadastro
├── DashboardPage.jsx        - Dashboard
├── PropertiesPage.jsx       - Lista de imóveis
├── PropertyForm.jsx         - Form de criação/edição
├── LeadsPage.jsx            - Lista de leads
└── AdminsPage.jsx           - Lista de admins

src/components/Admin/
├── Sidebar.jsx              - Sidebar navigation
├── PropertyCard.jsx         - Card de imóvel na lista
├── ImageUploader.jsx        - Upload de imagens
└── AdminRoute.jsx           - Protected route wrapper

src/hooks/
├── useAuth.jsx              - Auth state
└── useSupabaseAuth.jsx      - Supabase Auth integration
```

## Data Flow

### Registration Flow
1. User fills registration form → POST to `admin_users`
2. Trigger on INSERT → calls Edge Function `send-approval-email`
3. Email sent to company admin with approval link
4. Admin clicks link → approves/rejects
5. Trigger on UPDATE → calls Edge Function `send-approval-notification`
6. User receives confirmation email

### Property Creation Flow
1. Admin authenticated → navigates to `/admin/properties/new`
2. Fills form + uploads images to Supabase Storage
3. Form submit → INSERT to `properties` with `created_by = user.id`
4. Images uploaded with paths: `/properties/{property_id}/{filename}`
5. Success → redirect to `/admin/properties`

### Lead Viewing Flow
1. Admin authenticated → navigates to `/admin/leads`
2. Query `contact_forms` and `property_inquiries` tables
3. Display list with filters (date, status)
4. Mark as resolved → UPDATE status

## Security Model

### Row Level Security (RLS)

**admin_users:**
- Public: can INSERT (registration)
- Authenticated: can SELECT own record
- Admin: can SELECT all, UPDATE status/role

**properties:**
- Public: can SELECT (for public site)
- Authenticated admin: can INSERT, UPDATE own records
- Admin: can UPDATE/DELETE all records

**contact_forms, property_inquiries:**
- Public: can INSERT
- Authenticated admin: can SELECT all, UPDATE status

### Authentication
- Supabase Auth for session management
- Protected routes check `supabase.auth.getUser()`
- Redirect to `/admin/login` if not authenticated

## Error Handling

- Form validation errors displayed inline
- API errors displayed as toast notifications
- 404 on routes not found
- 401 on unauthorized access
- 500 on server errors with friendly message

## Testing Strategy

### Unit Tests
- Auth hooks
- Form validation
- Image upload logic

### Integration Tests
- Registration flow
- Property CRUD operations
- Lead status updates

### E2E Tests
- Login flow
- Create property flow
- Approve admin flow

## Implementation Phases

### Phase 1: Database & Auth (Priority 1)
- Create `admin_users` table
- Expand `properties` table
- Setup Supabase Storage bucket
- Configure RLS policies
- Implement auth hooks

### Phase 2: Registration & Approval (Priority 1)
- Registration page
- Edge functions for emails
- Approval page
- Admin list page

### Phase 3: Property Management (Priority 2)
- Property list page
- Property form (create/edit)
- Image upload component
- Soft delete

### Phase 4: Lead Management (Priority 3)
- Lead list page
- Status update
- Filters

### Phase 5: Dashboard (Priority 4)
- Statistics
- Recent activity
- Quick actions

## Dependencies to Add

- `@supabase/auth-helpers-react` - Auth helpers
- `react-hook-form` - Form management
- `zod` - Schema validation
- `react-dropzone` - Image upload

## Success Criteria

- [ ] Admin can login with email/password
- [ ] New registrations require approval
- [ ] Approval emails are sent correctly
- [ ] Admin can CRUD properties
- [ ] Image upload works with Supabase Storage
- [ ] Leads are visible and can be marked as resolved
- [ ] RBAC prevents unauthorized access
- [ ] Mobile layout is functional
