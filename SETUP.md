# Setup Guide - Viva Belle Imobiliária

## Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuito)
- Conta no Vercel (gratuito)
- Conta no Google Analytics (opcional)

## 1. Configuração Local

### Instalar dependências
```bash
npm install
```

### Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto (não commitar no git):

```env
# Supabase Configuration
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase

# Google Analytics (opcional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Site Configuration
VITE_SITE_URL=http://localhost:5173
```

### Rodar em desenvolvimento
```bash
npm run dev
```

O site estará disponível em `http://localhost:5173`

## 2. Configurar Supabase

### Criar projeto no Supabase

1. Acesse https://supabase.com e crie uma conta
2. Crie um novo projeto
3. Aguarde o projeto ser criado (2-3 minutos)
4. Vá em Settings > API
5. Copie `Project URL` e `anon/public key`
6. Cole no seu arquivo `.env.local`

### Criar tabelas no banco

1. No Supabase, vá em SQL Editor
2. Cole o conteúdo do arquivo `supabase/schema.sql`
3. Execute o script

Isso criará as tabelas:
- `contact_forms` - formulários de contato
- `property_inquiries` - interesse em imóveis
- `properties` - imóveis (para uso futuro)

### Configurar Row Level Security

O script já configura as políticas de segurança necessárias para permitir inserts públicos.

## 3. Configurar Google Analytics (Opcional)

1. Acesse https://analytics.google.com
2. Crie uma nova propriedade GA4
3. Copie o Measurement ID (formato: G-XXXXXXXXXX)
4. Cole no seu arquivo `.env.local` como `VITE_GA_MEASUREMENT_ID`

## 4. Deploy no Vercel

### Preparar para deploy

1. Commit suas mudanças no git
2. Crie um repositório no GitHub

### Deploy no Vercel

1. Acesse https://vercel.com e crie uma conta
2. Clique em "Add New Project"
3. Importe seu repositório do GitHub
4. Configure as variáveis de ambiente no Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GA_MEASUREMENT_ID` (opcional)
   - `VITE_SITE_URL` (seu domínio real, ex: https://vivabelle.com.br)
5. Clique em "Deploy"

O Vercel vai fazer o deploy automaticamente e fornecer uma URL.

### Configurar domínio personalizado

1. No Vercel, vá em Settings > Domains
2. Adicione seu domínio
3. Configure o DNS conforme instruções do Vercel

## 5. Atualizar arquivos públicos

### robots.txt
Substitua `yourdomain.com` pelo seu domínio real em `public/robots.txt`

### sitemap.xml
Substitua `yourdomain.com` pelo seu domínio real em `public/sitemap.xml`

### index.html
Atualize meta tags com informações reais da empresa em `index.html`

## 6. Substituir dados fictícios

Quando tiver dados reais:

1. **Imagens**: Substitua URLs do Unsplash por fotos reais dos imóveis
2. **Endereços**: Atualize em `src/data/index.js` e `src/components/Footer.jsx`
3. **Telefones**: Atualize em `src/components/Header.jsx` e `src/pages/ContatoPage/index.jsx`
4. **CRECI**: Atualize onde aparece (Footer, PropertyDetailPage)
5. **Email**: Atualize em `src/components/Footer.jsx` e `src/pages/ContatoPage/index.jsx`

## 7. Migrar dados para Supabase (Futuro)

Quando tiver dados reais de imóveis:

1. Use o painel do Supabase para inserir dados na tabela `properties`
2. Atualize o código para buscar dados do Supabase em vez de `src/data/index.js`
3. Remova o arquivo `src/data/index.js` ou use como fallback

## Troubleshooting

### Formulários não funcionam
- Verifique se as variáveis do Supabase estão corretas
- Verifique o console do navegador para erros
- O sistema usa fallback local se Supabase não estiver configurado

### Imagens não carregam
- Verifique se as URLs estão corretas
- O componente LazyImage mostra fallback se houver erro

### Analytics não aparece
- Verifique se o Measurement ID está correto
- Verifique o console do navegador para erros
- Pode levar 24-48h para dados aparecerem no GA4

## Estrutura do Projeto

```
aurea-imoveis/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── SEOHelmet.jsx
│   │   ├── LazyImage.jsx
│   │   └── Analytics.jsx
│   ├── hooks/           # Custom hooks
│   │   └── useFavorites.js
│   ├── lib/             # Utilitários e API
│   │   ├── supabase.js
│   │   └── api.js
│   ├── pages/           # Páginas do site
│   │   ├── HomePage/
│   │   ├── ListingPage/
│   │   ├── PropertyDetailPage/
│   │   ├── ContatoPage/
│   │   └── SobrePage/
│   ├── data/            # Dados mockados (temporário)
│   │   └── index.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/              # Arquivos estáticos
│   ├── robots.txt
│   └── sitemap.xml
├── supabase/            # Schema do banco
│   └── schema.sql
├── .env.example         # Exemplo de variáveis de ambiente
└── package.json
```

## Suporte

Para problemas ou dúvidas, verifique:
- Documentação do Supabase: https://supabase.com/docs
- Documentação do Vercel: https://vercel.com/docs
- Documentação do React: https://react.dev
