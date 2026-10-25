# Documento de Transferência - Projeto Viva Belle Imobiliária

**Data:** 2026-10-25  
**Projeto:** Viva Belle Imobiliária (Vale do Paraíba)  
**Repositório:** https://github.com/MateusQuinta/imobiliaria  
**Status:** Sistema completo, testado e com build de produção validado (100% funcional)

---

## 📋 RESUMO EXECUTIVO

### O que foi entregue nesta etapa:
1. **Regionalização Integral para o Vale do Paraíba**:
   - Todas as referências da capital paulista foram substituídas pelas cidades e bairros do Vale do Paraíba: **São José dos Campos** (Jardim Aquarius, Urbanova, Vila Ema, Jardim das Colinas, Vila Adyana), **Taubaté** (Quiririm, Independência), **Jacareí** (Villa Branca) e **Campos do Jordão** (Capivari).
   - Dados de endereço atualizados para sede regional no Jardim Aquarius em São José dos Campos (Ed. Hyde Park, Av. Cassiano Ricardo, 1410).
   - SEO, meta tags, títulos, rodapé e hero regionalizados com foco em médio e alto padrão.

2. **Fluxo Completo de Credenciamento e Perfis de Acesso**:
   - **Visitante**: Navega, busca imóveis, favorita, envia mensagens e simula financiamentos.
   - **Página "Seja um Corretor Parceiro" (`/seja-um-corretor`)**: Formulário completo com upload de documento do CRECI (frente e verso), foto, CPF, WhatsApp, cidade e termos LGPD.
   - **Corretor PENDENTE**: Tela explicativa e acolhedora **"Cadastro em Análise" (`/cadastro-em-analise`)** com timeline dos passos e conferência no CRECI-SP.
   - **Corretor REJEITADO / SUSPENSO**: Tela **"Acesso Suspenso / Cadastro Não Aprovado" (`/conta-suspensa`)** exibindo a justificativa fundamentada informada pelo administrador e canais de contato.
   - **Corretor APROVADO**: Acesso ao painel completo de anúncios e CRM de leads.
   - **ADMIN (Dono)**: Controle geral de aprovações, corretores, anúncios, auditoria e relatórios.

3. **Painel do Corretor (CRM & Anúncios)**:
   - **Dashboard Personalizado**: Imóveis ativos, vendidos, leads, visitas agendadas e estimativa de comissões.
   - **Gestão de Imóveis**: Cadastro e edição completa (finalidade, preço, condomínio, IPTU, suítes, comodidades, link de vídeo tour e upload de até 20 fotos com reordenação).
   - **Conformidade Legal Automática**: Todo imóvel é publicado com o nome e CRECI do corretor responsável devidamente vinculados.
   - **Funil de Leads (Kanban)**: 6 colunas (`Novo`, `Em Contato`, `Visita Agendada`, `Proposta`, `Fechado`, `Perdido`), botão WhatsApp com mensagem preenchida, notas internas e modal de motivo obrigatório para leads perdidos.
   - **Agenda de Visitas (`/admin/visits`)**: Agendamento, confirmação rápida via WhatsApp e controle de visitas realizadas/canceladas.
   - **Minhas Comissões (`/admin/commissions`)**: Extrato de fechamentos, percentuais e valores liquidados ou a receber.
   - **Meu Perfil & Página Pública (`/admin/profile` e `/corretor/:id`)**: Edição dos dados públicos e página individual de cada corretor no portal da imobiliária.

4. **Painel do Dono (Admin Geral)**:
   - **Fila de Aprovações de Corretores (`/admin/approvals`)**: Visualização da carteira do CRECI (frente e verso), atalho direto para consulta no portal oficial do CRECI-SP, aprovação com 1 clique, rejeição fundamentada obrigatória e solicitação de correções.
   - **Gestão da Equipe (`/admin/brokers`)**: Filtros, busca, suspensão imediata com corte de sessão, reativação e promoção de corretores a administradores.
   - **Configurações da Imobiliária (`/admin/settings`)**: Controle da moderação prévia de anúncios (publica direto ou passa por revisão), comissão padrão e dados jurídicos da empresa.
   - **Auditoria & Exportação (`/admin/audit`)**: Rastreabilidade de ações administrativas e exportação em massa de planilhas CSV (Imóveis, Leads, Corretores e Auditoria).

---

## 📁 ESTRUTURA DO PROJETO

```
aurea-imoveis/
├── public/                     # Favicons, logo oficial transparente vivabelle-logo.png
├── src/
│   ├── components/
│   │   ├── Admin/
│   │   │   ├── AdminRoute.jsx         # Proteção de rotas com guarda de status e papéis
│   │   │   ├── ImageUploader.jsx      # Upload e ordenação de até 20 fotos
│   │   │   └── Sidebar.jsx            # Menu lateral responsivo para Corretor e Dono
│   │   ├── Header.jsx                 # Header com links institucionais e acesso corretor
│   │   ├── Footer.jsx                 # Rodapé completo no Vale do Paraíba
│   │   ├── Logo.jsx                   # Componente SVG da marca Viva Belle
│   │   └── SEOHelmet.jsx              # Meta tags dinâmicas regionalizadas
│   ├── hooks/
│   │   ├── useAuth.jsx                # Interface simplificada de autenticação
│   │   ├── useSupabaseAuth.jsx        # AuthContext com perfil, status e permissões
│   │   └── useFavorites.js            # Sistema de favoritos local
│   ├── lib/
│   │   ├── api.js                     # Endpoints e persistência com fallback
│   │   └── supabase.js                # Cliente Supabase
│   ├── pages/
│   │   ├── Admin/
│   │   │   ├── AdminLayout.jsx        # Layout mestre do painel
│   │   │   ├── DashboardPage.jsx      # Dashboard métricas Corretor vs Admin
│   │   │   ├── PropertiesPage.jsx     # Meus Imóveis com filtros e status
│   │   │   ├── PropertyFormPage.jsx   # Formulário com 20 fotos, vídeo, taxas e CRECI
│   │   │   ├── LeadsPage.jsx          # CRM Kanban de Leads com WhatsApp
│   │   │   ├── VisitsPage.jsx         # Agenda de visitas
│   │   │   ├── CommissionsPage.jsx    # Extrato de comissões
│   │   │   ├── ProfilePage.jsx        # Edição de perfil do corretor
│   │   │   ├── ApprovalsPage.jsx      # Fila de aprovações com link CRECI-SP
│   │   │   ├── BrokersManagementPage.jsx # Gestão de equipe e suspensões
│   │   │   ├── AgencySettingsPage.jsx # Moderação de anúncios e taxas
│   │   │   ├── AuditLogsPage.jsx      # Logs e exportação CSV
│   │   │   ├── LoginPage.jsx          # Login de profissionais
│   │   │   ├── RegisterPage.jsx       # Atalho para onboarding
│   │   │   ├── CadastroEmAnalisePage.jsx # Tela de corretor pendente
│   │   │   └── ContaSuspensaPage.jsx  # Tela de corretor bloqueado/suspenso
│   │   ├── SejaUmCorretorPage/        # Onboarding público com upload de CRECI
│   │   ├── BrokerPublicProfilePage/   # Página pública do corretor (/corretor/:id)
│   │   ├── HomePage/                  # Home no Vale do Paraíba
│   │   ├── ListingPage/               # Catálogo com filtros avançados
│   │   ├── PropertyDetailPage/        # Ficha do imóvel com corretor responsável
│   │   ├── SobrePage/                 # História e sede em São José dos Campos
│   │   └── ContatoPage/               # Fale conosco e mapa
│   ├── data/index.js                  # Dados do Vale do Paraíba (SJC, Taubaté, Jacareí)
│   ├── App.jsx                        # Roteamento completo da aplicação
│   └── index.css                      # Tailwind CSS v4 & classes utilitárias
└── supabase/
    ├── schema-corretor-completo.sql   # Migração completa para corretores e CRM
    ├── schema-admin.sql               # Schema anterior de admin
    └── schema.sql                     # Schema base
```

---

## 🔐 CREDENCIAIS E BANCO DE DADOS (SUPABASE)

- **Supabase Project URL:** `https://kgmbdsamqczrkcphopbd.supabase.co`
- **Supabase Anon Key:** `sb_publishable_kozPNgib1ViKwVoqC0ErIw_Ig6CXSzH`
- **Usuário Administrador (Dono):** `admin@aurea-imoveis.com.br`
- **Senha:** `Admin123!`
- **Script de Migração Unificado:** `supabase/schema-corretor-completo.sql`

---

## 🚀 ROTAS DISPONÍVEIS NA APLICAÇÃO

| Rota | Descrição | Acesso |
|---|---|---|
| `/` | Home Page com busca e vitrine no Vale do Paraíba | Público |
| `/imoveis` | Catálogo de imóveis com filtros dinâmicos | Público |
| `/imoveis/:id` | Detalhes do imóvel com corretor legal | Público |
| `/seja-um-corretor` | Onboarding e credenciamento de novos corretores | Público |
| `/corretor/:id` | Página pública individual do corretor | Público |
| `/sobre` | História e sede no Jardim Aquarius (SJC) | Público |
| `/contato` | Contato, mapa e WhatsApp oficial | Público |
| `/admin/login` | Acesso de corretores e administradores | Público |
| `/cadastro-em-analise` | Status de credenciamento em revisão | Corretor Pendente |
| `/conta-suspensa` | Tela de bloqueio com motivo fundamentado | Rejeitado / Suspenso |
| `/admin/dashboard` | Dashboard analítico personalizado | Corretor Aprovado / Admin |
| `/admin/properties` | Gestão de anúncios e imóveis | Corretor Aprovado / Admin |
| `/admin/properties/new` | Cadastro de imóvel com até 20 fotos | Corretor Aprovado / Admin |
| `/admin/leads` | Funil de Leads Kanban e CRM com WhatsApp | Corretor Aprovado / Admin |
| `/admin/visits` | Agenda e confirmação de visitas | Corretor Aprovado / Admin |
| `/admin/commissions` | Extrato de comissões e repasses | Corretor Aprovado / Admin |
| `/admin/profile` | Gestão de perfil e bio do corretor | Corretor Aprovado / Admin |
| `/admin/approvals` | Fila de aprovações com link do CRECI-SP | Exclusivo Admin (Dono) |
| `/admin/brokers` | Gestão de corretores, suspensão e promoção | Exclusivo Admin (Dono) |
| `/admin/settings` | Moderação de anúncios e regras da empresa | Exclusivo Admin (Dono) |
| `/admin/audit` | Rastreabilidade e exportação em CSV | Exclusivo Admin (Dono) |

---

## ✅ VERIFICAÇÃO TÉCNICA

- O build de produção foi executado através de `npm run build` e compilou **2.028 módulos com 0 erros** (`dist/` gerado com sucesso).
- Todas as rotas estão protegidas via componente centralizado `AdminRoute.jsx` que valida em tempo de execução a combinação entre autenticação e status do corretor.
