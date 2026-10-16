# Agent Notes - Viva Belle Imobiliária

## Project Overview

Site imobiliário React + Vite para Viva Belle Imobiliária (médio/alto padrão em São Paulo).

## Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Dependencies Installed

- `@supabase/supabase-js` - SDK do Supabase para backend
- `react-hot-toast` - Toast notifications
- `react-helmet-async` - SEO com meta tags dinâmicas

## Key Technical Decisions

### Backend: Supabase
- PostgreSQL + Auth + Storage + Edge Functions
- Schema em `supabase/schema.sql`
- Tabelas: contact_forms, property_inquiries, properties
- Fallback local se Supabase não configurado

### Analytics: Google Analytics 4
- Componente `Analytics.jsx` carrega script GA4
- Hook `useAnalytics()` para tracking de eventos
- Configurável via `VITE_GA_MEASUREMENT_ID`

### State Management
- Favoritos: localStorage via custom hook `useFavorites.js`
- React state para formulários e filtros
- Sem Redux/Context (simples o suficiente sem)

### SEO
- React Helmet Async para meta tags dinâmicas
- Componente `SEOHelmet.jsx` reutilizável
- sitemap.xml e robots.txt em public/
- Open Graph e Twitter cards configurados

### Images
- Componente `LazyImage.jsx` para lazy loading
- Skeleton loading states
- Error handling com fallback

## File Structure Notes

### New Files Created
- `src/lib/supabase.js` - Configuração do Supabase
- `src/lib/api.js` - Funções de API com fallback
- `src/hooks/useFavorites.js` - Hook de favoritos
- `src/components/SEOHelmet.jsx` - SEO component
- `src/components/Analytics.jsx` - GA4 integration
- `src/components/LazyImage.jsx` - Lazy loading images
- `supabase/schema.sql` - Database schema
- `SETUP.md` - Setup guide completo
- `.env.example` - Environment variables template

### Modified Files
- `src/main.jsx` - Added Toaster and Analytics
- `src/App.jsx` - Added HelmetProvider
- `src/pages/HomePage/index.jsx` - Added SEOHelmet
- `src/pages/ListingPage/index.jsx` - Added SEOHelmet, LazyImage, useFavorites
- `src/pages/PropertyDetailPage/index.jsx` - Added SEOHelmet, LazyImage, useFavorites, API integration
- `src/pages/ContatoPage/index.jsx` - Added SEOHelmet, API integration
- `src/components/Header.jsx` - Added useFavorites for badge count
- `public/robots.txt` - Created
- `public/sitemap.xml` - Created
- `README.md` - Updated with project info

## Known Issues / TODOs

### Critical (Before Production)
- [ ] Substituir todos os dados fictícios:
  - Endereço real da empresa
  - Telefone real
  - Email real
  - CRECI real
  - CNPJ real
- [ ] Substituir imagens do Unsplash por fotos reais
- [ ] Configurar Supabase com credenciais reais
- [ ] Executar schema.sql no Supabase
- [ ] Atualizar VITE_SITE_URL com domínio real

### Important
- [ ] Remover StyleGuide do App.jsx em produção
- [ ] Configurar Google Analytics se quiser tracking
- [ ] Adicionar página de SobrePage/index.jsx (existe mas verificar se está completa)
- [ ] Adicionar página de Blog (link existe no Footer mas página não)
- [ ] Verificar acessibilidade WCAG

### Nice to Have
- [ ] Migrar dados de src/data/index.js para Supabase
- [ ] Adicionar página de Login para admin
- [ ] Painel admin para gerenciar imóveis
- [ ] Upload de imagens via Supabase Storage
- [ ] Email real via Resend (integrado no Supabase)
- [ ] Testes E2E com Playwright
- [ ] Testes unitários com Vitest
- [ ] Type checking com TypeScript

## Environment Variables

Required:
- `VITE_SUPABASE_URL` - URL do projeto Supabase
- `VITE_SUPABASE_ANON_KEY` - Chave anônima do Supabase

Optional:
- `VITE_GA_MEASUREMENT_ID` - Measurement ID do GA4
- `VITE_SITE_URL` - URL do site (para SEO/canonical)

## Deployment

Target: Vercel
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables configuradas no Vercel

## Data Flow

### Contact Form
1. User submits form in ContatoPage
2. `submitContactForm()` calls Supabase
3. If Supabase fails, fallback to success (simulated)
4. Toast notification shown

### Property Inquiry
1. User submits form in PropertyDetailPage
2. `submitPropertyInquiry()` calls Supabase
3. If Supabase fails, fallback to success (simulated)
4. Toast notification shown

### Favorites
1. User clicks heart icon
2. `toggleFavorite()` updates localStorage
3. Header badge count updates
4. Toast notification shown

## Design System

Colors (defined in src/index.css):
- Navy: #0F2A4A (primary)
- Gold: #C9952A (accent)
- Warm neutrals: #F8F5F0, #3A3A32

Fonts:
- Serif: Playfair Display (headings)
- Sans: Inter (body)

Components:
- Buttons: .btn, .btn-primary, .btn-secondary, .btn-ghost
- Inputs: .input-field
- Badges: .badge, .badge-venda, .badge-aluguel, .badge-lancamento
- Cards: .property-card
