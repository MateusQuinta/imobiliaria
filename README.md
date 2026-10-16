# Viva Belle Imobiliária

Site imobiliário profissional desenvolvido com React + Vite + Tailwind CSS.

## 🚀 Tecnologias

- **Frontend**: React 19, Vite 8
- **Estilização**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Email**: Resend (via Supabase)
- **Analytics**: Google Analytics 4
- **Deploy**: Vercel
- **SEO**: React Helmet Async + sitemap.xml + robots.txt

## ✨ Funcionalidades

- ✅ Sistema de favoritos com localStorage
- ✅ Formulários de contato funcionais (integrados com Supabase)
- ✅ Lazy loading de imagens
- ✅ SEO otimizado com meta tags dinâmicas
- ✅ Loading states e error handling
- ✅ Toast notifications (react-hot-toast)
- ✅ Responsivo para mobile e desktop
- ✅ Filtragem avançada de imóveis
- ✅ Página de detalhes completa

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Rodar em desenvolvimento
npm run dev
```

## ⚙️ Configuração

Veja o guia completo em [SETUP.md](./SETUP.md) para:
- Configurar Supabase
- Configurar Google Analytics
- Deploy no Vercel
- Substituir dados fictícios

## 📁 Estrutura

```
src/
├── components/     # Componentes reutilizáveis
├── hooks/         # Custom hooks (useFavorites)
├── lib/           # API e utilitários (Supabase)
├── pages/         # Páginas do site
└── data/          # Dados mockados (temporário)
```

## 🚢 Deploy

O projeto está configurado para deploy no Vercel. Veja [SETUP.md](./SETUP.md) para instruções detalhadas.

## 📝 Notas Importantes

- Dados de contato, endereços e CRECI são fictícios e precisam ser substituídos
- Imagens são do Unsplash e precisam ser substituídas por fotos reais
- Supabase precisa ser configurado para formulários funcionarem
- Google Analytics é opcional

## 📄 Licença

Privado - Viva Belle Imobiliária
